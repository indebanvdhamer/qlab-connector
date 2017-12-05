import angular from 'angular';

//IMPORTS
import './errors';
import './endpoint';

const constants = angular.module('app.constants', [
  'app.constants.endpoint',
  'app.constants.errors',
]);

export default constants;
