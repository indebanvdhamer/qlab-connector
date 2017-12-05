import angular from 'angular';
import template from './cue.html';
import './cue.scss';

const cueComponent = {
  bindings: {
    data: '<',
    action: '&'
  },
  template,
  controller: function($element) {
    'ngInject';

    this.lock = cue => cue.isLocked = !cue.isLocked;

    this.$onInit = () => {
      if(this.data.command === 'preWait') {
        $element.addClass('preWait');
      }
    };

  },
  controllerAs: 'vm'
};

angular.module('app.components.cue', []).component('cue', cueComponent);
export default cueComponent;
