import angular from 'angular';

//IMPORTS
import './Meta';
import './Socket';

const services = angular.module('app.services', [
  'app.services.Socket',
  'app.services.Meta',
]);

export default services;
