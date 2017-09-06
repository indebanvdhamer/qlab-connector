import angular from 'angular';

//IMPORTS
import './playbackTime';

const filters = angular.module('app.filters', [
  'app.filters.playbackTime',
]);

export default filters;
