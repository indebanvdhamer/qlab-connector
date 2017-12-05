const {remove, each, isUndefined, uniqBy} = require('lodash');
const io = require('socket.io')({
  path: '/api/socket.io'
});
const log = require('./log');
const QLab = require('./QLab');
const {udpPort, udpSend} = require('./Udp');

const connections = [];

const getUniqueCues = cues => uniqBy(cues.filter(cue => !isUndefined(cue.number)), 'number');

const getPacket = (number, keys) => ({
  address: `/cue/${number}/valuesForKeys`,
  args: [{type: 's', value: JSON.stringify(keys)}]
});

const sendInitialCommands = cues => {
  const cuePackets = getUniqueCues(cues).map(c => getPacket(c.number, c.initKeys.concat(c.updateKeys)));
  udpSend({
    packets: [QLab.command(null, 'workspaces')].concat(cuePackets),
    timeTag: 0
  });
};

const sendCommand = cue => {
  const command = QLab[cue.numbers ? 'getCommands' : 'getCommand'](cue);
  if(command) {
    udpSend(command);
  }
};

const sendCommandOld = cue => {
  const command = QLab.getCommandOld(cue);
  if(command) {
    udpSend(command);
  }
};

const handleMessage = oscMessage => {
  log('QLab <-', oscMessage.address);
  const tasks = QLab.handleIncoming(oscMessage);
  if(tasks) {
    if(tasks.qlab) {
      udpSend(QLab.getUpdates(tasks.qlab));
    }
    if(tasks.q) {
      sendCommandOld(tasks.q);
    }
    if(tasks.s) {
      each(tasks.s, task => io.emit('qlab.response', task));
    }
    if(tasks.error) {
      io.emit('qlab.error', tasks.error);
    }
  }
};

const sendRawCommand = data => {
  log('QLab ->', data);
  udpSend(data, true);
};

const handleBundle = oscBundle => {
  log('QLab <-', oscBundle);
  io.emit('osc.bundle', oscBundle);
};

udpPort.on('message', handleMessage);
udpPort.on('bundle', handleBundle);

const sockInstance = () => {
  io.on('connection', socket => {
    log('Socket', 'Connected');

    socket.emit('schouwburg', QLab.schouwburg);
    socket.id = new Date().toISOString();
    const instance = {id: socket.id};
    connections.push(instance);

    sendInitialCommands(QLab.schouwburg);

    socket.on('qlab.raw', sendRawCommand);
    socket.on('qlab.command', cue => sendCommand(cue));

    socket.on('disconnect', () => {
      log('Socket', 'Disconnected');
      remove(connections, {id: socket.id});
    });
  });

  return io;
};

module.exports = {
  sockInstance,
};
