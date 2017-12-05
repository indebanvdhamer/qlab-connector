import angular from 'angular';
import io from 'socket.io-client';

const SocketService = function(endpoint) {
  'ngInject';

  this.getSocket = () => {
    const socket = io(endpoint, {
      path: '/api/socket.io',
      transports: ['websocket']
    });

    socket.on('connect', console.log);
    socket.on('disconnect', console.warn);

    socket.sendCommand = data => socket.emit('command', data);
    socket.rawCommand = data => socket.emit('qlab.raw', data);

    return socket;
  };
};

angular.module('app.services.Socket', []).service('Socket', SocketService);
export default SocketService;
