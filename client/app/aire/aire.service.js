'use strict';

angular.module('datafestApp')
  .factory('Aire', function ($resource) {
    return $resource('/api/aires/:id');
  });