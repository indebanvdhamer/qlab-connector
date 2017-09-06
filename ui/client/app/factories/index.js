import angular from 'angular';

//IMPORTS
import './endpointInterceptor';
import './bodyCleaningInterceptor';

const factories = angular.module('app.factories', [
  'app.factories.bodyCleaningInterceptor',
  'app.factories.endpointInterceptor',
]);

export default factories;
