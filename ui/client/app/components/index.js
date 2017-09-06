import angular from 'angular';

//IMPORTS
import './cue/cue';

const components = angular.module('app.components', [
  'app.components.cue',
]);

export default components;
