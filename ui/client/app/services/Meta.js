import angular from 'angular';

const MetaService = function($http) {
  'ngInject';

  this.getSchouwburg = () => $http.get('/schouwburg');
};

angular.module('app.services.Meta', []).service('Meta', MetaService);
export default MetaService;
