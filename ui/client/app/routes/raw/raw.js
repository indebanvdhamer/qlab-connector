import angular from 'angular';
import routeWrap from 'ng-component-routing';
import template from './raw.html';
import './raw.scss';

const controller = function(Socket) {
  'ngInject';

  this.sendCommand = data => {
    console.log(JSON.parse(data));
    Socket.rawCommand(JSON.parse(data));
  };

  Socket.on('qlab.response', data => {
    console.log('qlab.response', data);
  });

};

const rawComponent = {
  bindings: {},
  routeOpts: {
    name: 'raw',
    url: '/raw',
    //componentBindings: [],
    //resolve: [],
    pageTitle: 'raw',
  },
  template,
  controller,
  controllerAs: 'vm'
};

routeWrap(angular).module('app.routes.raw', []).route('raw', rawComponent);
export default rawComponent;
