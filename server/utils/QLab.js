const {map, get, isArray, each, filter, compact, flatten} = require('lodash');
const commands = require('../constants/commands');
const {udpSend} = require('./Udp');
const schouwburg = require('../constants/schouwburg');

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
    return cue;
  });
};

populateCommands(schouwburg);

const command = (data, name) => isArray(data)
  ? {packets: map(data, d => get(commands, d.name)(d.data)), timeTag: 0}
  : get(commands, name)(data);

const actions = {
  arm: cue => [
    {name: 'cue.armed', data: {number: cue.number, value: cue.armed ? 0 : 1}},
    {name: 'cue.armed', data: {number: cue.number}},
  ],
  disarm: cue => [{name: 'cue.armed', data: {number: cue.number, value: 0}}],
  play: cue => [
    {name: 'cue.start', data: {number: cue.number}},
    {name: 'cue.actionElapsed', data: {number: cue.number}},
    {name: 'cue.isRunning', data: {number: cue.number}},
  ],
  preWait: cue => [
    {name: 'cue.preWait', data: {number: cue.number, value: cue.preWaitMins !== undefined ? cue.preWaitMins * 60 : cue.preWait}},
    {name: 'cue.start', data: {number: cue.number}},
    {name: 'cue.isRunning', data: {number: cue.number}},
  ],
  stop: cue => [{name: 'cue.stop', data: {number: cue.number}}],
  playPrewait: cue => [
    {name: 'cue.preWait', data: {number: cue.number, value: cue.preWait}},
    {name: 'cue.start', data: {number: cue.number}},
    {name: 'cue.isRunning', data: {number: cue.number}},
  ],
  //eslint-disable-next-line camelcase
  disarm_stop: cue => map(cue.numbers, number => ({name: 'cue.start', data: {number}})),
};

const getCommand = data => command(data.command && actions[data.command] ? actions[data.command](data) : data);

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
  udpSend(command(cue.update));
};
const handleIncoming = data => {
  const res = isArray(data.args) ? map(data.args, parseResponse) : parseResponse(data.args);

  if(data.address === '/reply/workspaces') {
    const workspace = res[0].data[0];
    return {
      q: [{name: 'receiveUpdates', data: {id: workspace.uniqueID}}],
      s: [{workspace: workspace}],
    };
  }

  if(data.address.indexOf('/update/workspace') > -1 && data.address.indexOf('/cue_id') > -1) {
    const uniqueID = data.address.substr(data.address.lastIndexOf('/') + 1);
    const cues = filter(schouwburg, {uniqueID});
    // Run update checks for cues
    return {
      q: compact(flatten(map(cues, 'update'))),
      // s: [{cues}],
    };
  }

  // //Reply for a cue
  if(data.address.indexOf('/reply/cue') > -1) {
    const match = cueNumber.exec(data.address);
    if(match) {
      const number = Number(match[0]);
      const cues = filter(schouwburg, {number});
      const reply = data.address.substr(data.address.lastIndexOf('/') + 1);
      const response = map(cues, (cue, idx) => {
        cue[reply] = res[0].data;
        if((reply !== 'actionElapsed' && reply !== 'preWaitElapsed' && reply !== 'isRunning') || (cues[idx - 1] && cues[idx - 1].interval)) {
          return cue;
        }
        if(cue.isRunning && !cue.interval && !intervals[`${cue.number}|${cue.label}`]) {
          cue.interval = `${cue.number}|${cue.label}`;
          intervals[`${cue.number}|${cue.label}`] = setInterval(() => udpSend(command(cue.update)), 200);
          setTimeout(
            clear(cue),
            ((cue.command === 'play' ? (cue.duration || 0 - cue.actionElapsed || 0) : (cue.preWait || 0 - cue.preWaitElapsed || 0)) * 1000) + 1000
          );
        }
        if(!cue.isRunning && cue.interval) {
          setTimeout(clear(cue), 1000);
        }
        return cue;
      });
      return {
        // q: [],
        s: [{cues: response}],
      };
    }
  }

  return {
    // q: [],
    s: [{reply: data}],
  };

};

module.exports = {
  command,
  schouwburg,
  getCommand,
  actions,
  handleIncoming
};
