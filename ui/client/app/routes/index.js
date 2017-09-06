import angular from 'angular';

//IMPORTS
import './pong/pong';
import './dashboard/dashboard';

const routes = angular.module('app.routes', [
  'app.routes.dashboard',
  'app.routes.pong',
]);

export default routes;
