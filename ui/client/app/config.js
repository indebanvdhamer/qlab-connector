/* global environment */
import angular from 'angular';

const config = ($locationProvider, $stateProvider, $urlRouterProvider, $logProvider, $provide, $mdThemingProvider) => {
  'ngInject';

  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $provide.decorator('$log', ['$delegate', function ($delegate) {
    const hooks = ['info', 'debug', 'warn', 'error'];
    let level = hooks.indexOf(environment.log);
    //turn off all logs
    if(level === -1) {level = 1000;}
    hooks.forEach(hook => {
      $delegate[hook] = hook.indexOf(hook) >= level ? $delegate[hook] : angular.noop;
    });
    return $delegate;
  }]);

  // //Define theme
  // const theme = $mdThemingProvider.extendPalette('green', {
  //   500: '#ccc',
  //   'hue-1': '#ccc', // use shade 100 for the <code>md-hue-1</code> class
  //   'hue-2': '#008000', // use shade 600 for the <code>md-hue-2</code> class
  // });
  // $mdThemingProvider.definePalette('theme', theme);
  // $mdThemingProvider.theme('default')
  //   .primaryPalette('theme')
  //   // .accentPalette('blue-grey');
};

export default config;
