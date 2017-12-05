/* global environment */
import {zipObject, map, find, noop} from 'lodash-es';

const config = ($locationProvider, $urlRouterProvider, $provide) => {
  'ngInject';

  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  //Setup log levels
  const logLevels = ['debug', 'info', 'warn', 'error'];
  $provide.decorator('$log', ['$delegate', $delegate =>
    zipObject(logLevels, map(logLevels, method => find(environment.log, l => l === method) ? $delegate[method] : noop))
  ]);
};

export default config;
