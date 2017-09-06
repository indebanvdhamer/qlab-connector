import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import './app.scss';

//require modules
import './services';
import './routes';
import './components';
import './constants';
import './factories';
import './filters';

import config from './config';
import run from './run';

const dependencies = [
  uiRouter,
  ngMaterial,
  ngMessages,
  ngAria,
  'app.constants',
  'app.factories',
  'app.services',
  'app.filters',
  'app.routes',
  'app.components',
];

angular.module('app', dependencies)
  .config(config)
  .run(run);
