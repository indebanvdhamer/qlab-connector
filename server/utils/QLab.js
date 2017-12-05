const {map, get, isArray, each, filter, size, find} = require('lodash');
const commands = require('../constants/commands');
const {udpSend} = require('./Udp');
const schouwburg = require('../constants/schouwburg');

const groupStatusKeys = [
  'children',
  'isRunning',
];

const populateCommands = cmds => {
  each(cmds, cue => {

    cue.init = [{name: 'cue.uniqueID', data: {number: cue.number}}];
    if(cue.command === 'play') {
      cue.update = [
        {name: 'cue.duration', data: {number: cue.number}},
        {name: 'cue.actionElapsed', data: {number: cue.number}},
        {name: 'cue.isRunning', data: {number: cue.number}},
      ];
    }
    if(cue.command === 'group') {
      cue.update = [
        {name: 'cue.isRunning', data: {number: cue.number}},
        {name: 'cue.children', data: {number: cue.number}},
      ];
    }
    if(cue.command === 'arm') {
      cue.update = [
        {name: 'cue.armed', data: {number: cue.number}},
      ];
    }
    if(cue.command === 'preWait' || cue.command === 'playPrewait') {
      cue.update = [
        {name: 'cue.preWait', data: {number: cue.number}},
        {name: 'cue.preWaitElapsed', data: {number: cue.number}},
        {name: 'cue.isRunning', data: {number: cue.number}},
      ];
    }

    cue.initKeys = ['uniqueID', 'cueTargetNumber'];
    if(cue.command === 'play') {
      cue.updateKeys = [
        'duration',
        'actionElapsed',
        'isRunning',
      ];
    }
    if(cue.command === 'group') {
      cue.updateKeys = groupStatusKeys;
    }
    if(cue.command === 'arm') {
      cue.updateKeys = [
        'armed',
      ];
    }
    if(cue.command === 'preWait' || cue.command === 'playPrewait') {
      cue.updateKeys = [
        'preWait',
        'preWaitElapsed',
        'isRunning',
      ];
    }
    return cue;
  });
};

populateCommands(schouwburg);

const command = (data, name) => isArray(data)
  ? {packets: map(data, d => get(commands, d.name)(d.data)), timeTag: 0}
  : get(commands, name)(data);

const actions = {
  arm: cue => ({
    write: {
      armed: [cue.armed ? 0 : 1]
    },
    read: [
      'armed'
    ]
  }),
  disarm: () => ({
    write: {
      armed: [0]
    },
    read: [
      'armed'
    ]
  }),
  play: () => ({
    write: {
      armed: [1],
    },
    read: [
      'start',
      'actionElapsed',
      'isRunning',
    ]
  }),
  preWait: cue => ({
    write: {
      preWait: [cue.preWaitMins !== undefined ? cue.preWaitMins * 60 : cue.preWait],
      armed: [1],
    },
    read: [
      'start',
      'isRunning',
    ]
  }),
  stop: () => ({
    read: ['stop']
  }),
  playPrewait: cue => ({
    write: {
      preWait: [cue.preWait],
      armed: [1],
    },
    read: [
      'start',
      'isRunning',
    ]
  }),
  //eslint-disable-next-line camelcase
  disarm_stop: () => ({
    read: ['start']
  }),
};

const getPacket = (number, keys) => ({
  address: `/cue/${number}/valuesForKeys${Array.isArray(keys) ? '' : 'WithArguments'}`,
  args: [{type: 's', value: JSON.stringify(keys)}]
});

const getCommands = cue => {
  if(!actions[cue.command]) {
    console.log(`${cue.command} action not found`);
  }
  const keys = actions[cue.command](cue);
  const writePacket = size(keys.write) ? cue.numbers.map(num => getPacket(num, keys.write)) : [];
  const readPacket = size(keys.read) ? cue.numbers.map(num => getPacket(num, keys.read)) : [];
  return {
    packets: writePacket.concat(readPacket),
    timeTag: 0
  };
};

const getCommand = cue => {
  if(!actions[cue.command]) {
    console.log(`${cue.command} action not found`);
  }
  const keys = actions[cue.command](cue);
  const writePacket = size(keys.write) ? [getPacket(cue.number, keys.write)] : [];
  const readPacket = size(keys.read) ? [getPacket(cue.number, keys.read)] : [];
  console.log(cue.cueTargetNumber);
  const groupStatus = cue.cueTargetNumber !== undefined ? [getPacket(cue.cueTargetNumber, groupStatusKeys)] : [];
  return {
    packets: writePacket.concat(readPacket).concat(groupStatus),
    timeTag: 0
  };
};

const getUpdates = cues => ({
  packets: cues.map(cue => getPacket(cue.number, cue.updateKeys)),
  timeTag: 0
});

const getCommandOld = data => command(data.command && actions[data.command] ? actions[data.command](data) : data);

const parseResponse = str => {
  try {
    return JSON.parse(str);
  } catch(err) {
    return str;
  }
};

const intervals = {};
const cueNumber = /[0-9]+/;
const clear = cue => () => {
  clearInterval(intervals[cue.interval]);
  cue.interval = null;
  udpSend({
    packets: [getPacket(cue.number, cue.updateKeys)],
    timeTag: 0
  });
};
const handleIncoming = data => {
  // console.log(data.address);
  const res = isArray(data.args) ? map(data.args, parseResponse) : parseResponse(data.args);

  if(data.address === '/reply/workspaces') {
    const workspace = res[0].data[0];
    return workspace ? {
      q: [{name: 'receiveUpdates', data: {id: workspace.uniqueID}}],
      s: [{workspace: workspace}],
    } : {
      error: {
        message: 'Can\'t connect to workspace',
        reason: 'no_workspace_connection'
      }
    };
  }

  // //Reply for a cue
  if(data.address.includes('valuesForKeysWithArguments') || data.address.includes('valuesForKeys')) {
    const match = cueNumber.exec(data.address);
    if(match) {
      const number = Number(match[0]);
      const data = res[0].data;
      // console.log(data);
      if(!data) {
        return {};
      }
      const cues = map(filter(schouwburg, {number}), oldCue => {
        const cue = Object.assign(oldCue, data);
        const packets = [getPacket(cue.number, cue.updateKeys)];
        // console.log(cue.cueTargetNumber);
        // if(cue.cueTargetNumber !== undefined) {
        //   console.log('hallo?');
        //   packets.push(getPacket(cue.cueTargetNumber, groupStatusKeys));
        // }
        if(cue.isRunning) {
          if(cue.isGroup) {
            const currentSubCue = find(cue.children, c => c.armed && c.type === 'Audio');
            cue.currentSubCueName = currentSubCue ? currentSubCue.name : undefined;
          }
          setTimeout(() => udpSend({
            packets,
            timeTag: 0
          }), 500);
        } else if(cue.isGroup) {
          cue.currentSubCueName = undefined;
        }
        return cue;
      });
      return {s: [{cues}]};
    }
  }

  // Run update checks for cues
  if(data.address.indexOf('/update/workspace') > -1 && data.address.indexOf('/cue_id') > -1) {
    const uniqueID = data.address.substr(data.address.lastIndexOf('/') + 1);
    const cues = filter(schouwburg, {uniqueID});
    return {
      qlab: cues,
    };
  }

  // /update/workspace/{id}/disconnect

  return {s: [{reply: data}]};

};

module.exports = {
  command,
  schouwburg,
  getCommand,
  getCommands,
  getCommandOld,
  actions,
  getUpdates,
  handleIncoming
};
