/* eslint camelcase:0 */
import angular from 'angular';

const errors = {
  no_workspace_connection: 'Can\'t connect to the workspace. Please check if you have opened the right workspace and refresh the page.'
};

angular.module('app.constants.errors', []).constant('errors', errors);
export default errors;
