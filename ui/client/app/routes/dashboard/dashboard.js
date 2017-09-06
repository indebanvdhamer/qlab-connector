import angular from 'angular';
import {each, cloneDeep} from 'lodash-es';
import routeWrap from 'ng-component-routing';
import template from './dashboard.html';
import './dashboard.scss';

const controller = function(Socket, $scope) {
  'ngInject';

  const timeouts = {};

  const replies = {
    actionElapsed: (data, cue) => {
      cue.actionElapsedParsed = data * 1000;
      return data;
    },
    duration: (data, cue) => {
      cue.durationParsed = data * 1000;
      return data;
    },
    preWaitElapsed: (data, cue) => {
      cue.preWaitElapsedParsed = data * 1000;
      return data;
    },
    preWait: (data, cue) => {
      cue.preWaitParsed = data * 1000;
      cue.preWaitMins = data / 60;
      return data;
    },
    armed: data => Boolean(data),
  };

  Socket.on('schouwburg', data => {
    // console.log('schouwburg');
    this.cues = cloneDeep(data);
    $scope.$digest();
  });
  Socket.on('qlab.response', data => {
    // console.log('qlab.response', data);
    if(data.workspace) {
      this.workspace = data.workspace;
    }
    if(data.cues) {
      each(data.cues, c => {
        each(this.cues, cue => {
          if(cue.number === c.number && cue.label === c.label) {
            each(replies, (r, key) => {
              if(c[key] !== undefined) {
                c[key] = r(c[key], c);
              }
            });
            each(c, (val, key) => {
              cue[key] = val;
            });
          }
        });
      });
    }
    $scope.$digest();
  });

  this.$onDestroy = () => {
    Socket.off('schouwburg');
    Socket.off('qlab.response');
  };

  this.action = cue => {
    // console.log('action', cue.number, cue.label);
    Socket.emit('qlab.command', cue);
  };

};

const dashboardComponent = {
  bindings: {},
  routeOpts: {
    name: 'dashboard',
    url: '/',
    pageTitle: 'dashboard',
  },
  template,
  controller,
  controllerAs: 'vm'
};

routeWrap(angular).module('app.routes.dashboard', []).route('dashboard', dashboardComponent);
export default dashboardComponent;
