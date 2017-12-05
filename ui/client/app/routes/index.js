import angular from 'angular';

//IMPORTS
import './raw/raw';
import './pong/pong';
import './dashboard/dashboard';

const routes = angular.module('app.routes', [
  'app.routes.dashboard',
  'app.routes.pong',
  'app.routes.raw',
]);

export default routes;
