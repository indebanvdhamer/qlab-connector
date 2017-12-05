import angular from 'angular';
import {each, filter, map} from 'lodash-es';
import routeWrap from 'ng-component-routing';
import template from './dashboard.html';
import './dashboard.scss';

const controller = function(Socket, $scope, errors) {
  'ngInject';

  this.error = null;

  const replies = {
    actionElapsed: (data, cue) => {
      // cue.dontAnimate = data * 1000 - (oldCue.prevActionElapsed || 0) > 1000;
      cue.actionElapsedParsed = data * 1000;
      cue.actionRemainingParsed = (cue.duration - data) * 1000 || 0;
      return data;
    },
    duration: (data, cue) => {
      cue.durationParsed = data * 1000;
      return data;
    },
    preWaitElapsed: (data, cue) => {
      // cue.dontAnimate = data * 1000 - (cue.prevPreWaitElapsed * 1000 || 0) > 1000;
      cue.preWaitElapsedParsed = data * 1000;
      cue.preWaitRemainingParsed = (cue.preWait - data) * 1000 || 0;
      return data;
    },
    preWait: (data, cue) => {
      cue.preWaitParsed = data * 1000;
      cue.preWaitMins = data / 60;
      return data;
    },
    armed: data => Boolean(data),
    isRunning: (data, cue) => {
      cue.finished = !data;
      return data;
    }
  };

  const socket = Socket.getSocket();

  let qlabConnectionTimeout;

  const socketConnectionTimeout = setTimeout(() => {
    this.error = 'Could not connect to Server.';
    // console.error(this.error);
    $scope.$apply();
  }, 2000);

  socket.on('schouwburg', cues => {
    this.error = null;
    qlabConnectionTimeout = setTimeout(() => {
      this.error = errors.no_workspace_connection;
      // console.error(this.error);
      $scope.$apply();
    }, 2000);
    // console.log('schouwburg');
    clearTimeout(socketConnectionTimeout);
    this.cues = map(cues, cue => Object.assign({}, cue, {prevActionElapsed: 0, prevPreWaitElapsed: 0}));
    $scope.$apply();
  });
  socket.on('qlab.response', data => {
    this.error = null;
    // console.log('qlab.response', data);
    clearTimeout(qlabConnectionTimeout);
    if(data.workspace) {
      this.workspace = data.workspace;
    }

    if(data.cues) {
      each(data.cues, c => {
        const affectedCues = filter(this.cues, {number: c.number, label: c.label});
        each(affectedCues, cue => {
          each(replies, (r, key) => {
            if(c[key] !== undefined) {
              c[key] = r(c[key], c, cue);
            }
          });
          each(c, (val, key) => {
            cue[key] = val;
          });
        });
      });
    }
    $scope.$apply();
  });
  socket.on('qlab.error', err => {
    clearTimeout(qlabConnectionTimeout);
    this.error = errors[err.reason] || err.message;
    // console.error(this.error);
  });

  this.$onDestroy = () => {
    socket.off('schouwburg');
    socket.off('qlab.response');
    socket.off('qlab.error');
    socket.close();
  };

  this.action = cue => {
    // console.log('action', cue.number, cue.label);
    socket.emit('qlab.command', cue);
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
