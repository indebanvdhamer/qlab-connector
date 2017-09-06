const {remove, each, map, compact, flatten} = require('lodash');
const io = require('socket.io')({
  path: '/api/socket.io'
});
const log = require('./log');
const QLab = require('./QLab');
const {udpPort, udpSend} = require('./Udp');

const connections = [];
const sendCommand = data => {
  const command = QLab.getCommand(data);
  if(command) {
    udpSend(command);
  }
};

const handleMessage = oscMessage => {
  log('QLab <-', oscMessage.address);
  const tasks = QLab.handleIncoming(oscMessage);
  if(tasks) {
    if(tasks.q) {
      sendCommand(tasks.q);
    }
    if(tasks.s) {
      each(tasks.s, task => io.emit('qlab.response', task));
    }
  }
};

const sendRawCommand = data => {
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

    sendRawCommand(QLab.command(null, 'workspaces'));
    sendCommand(flatten(compact(map(QLab.schouwburg, 'init'))));
    sendCommand(flatten(compact(map(QLab.schouwburg, 'update'))));

    socket.on('qlab.raw', sendRawCommand);
    socket.on('qlab.command', data => {
      console.log('command');
      sendCommand(data);
    });

    socket.on('disconnect', () => {
      log('Socket', 'Disconnected');
      remove(connections, {id: socket.id});
    });
    console.log(io.sockets.sockets.length);
    console.log(io.sockets.clients());
    console.log(socket.eventNames());
  });

  return io;
};

module.exports = {
  sockInstance,
};
