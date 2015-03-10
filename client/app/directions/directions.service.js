'use strict';

angular.module('datafestApp')
    .factory('directions', function($q, $http, polution) {
        // Service logic
        // ...

        var _direction = {};


        var _directionUrl = "http://utility.arcgis.com/usrsvcs/appservices/K7zMqxaPxhfyMaUr/rest/services/World/Route/NAServer/Route_World/solve";

        var _token = "fj00QAdgruZ4kWjnZZvEK2Ow7hr4OH0bYzoRJ9ow_N_jh2ZgLc9x_-pomSw5IAspy8nD8HGWxN9j3YLlJr2k_oebdXhHQgFnlPlePFVqlE9ez1gPUVVjGvW1SZZoGxAB";


        _direction.getRoute = function( p_stops, p_barriers ) {
            
            var deferred = $q.defer();
            
            var stops = {"type":"features","features": p_stops,"doNotLocateOnRestrictedElements":true};

            var barriers = {"type":"features","features": p_barriers };
            
            var params = {
                //token : _token,
                returnDirections : true,
                returnRoutes : true,
                returnStops: true,
                returnBarriers: false,
                returnPolygonBarriers: false,
                returnPolylineBarriers: false,
                //outSR: 4326,
                //outputLines: 'esriNAOutputLineTrueShape',
                findBestSequence: false,
                preserveFirstStop: false,
                preserveLastStop: false,
                directionsLengthUnits: 'esriNAUKilometers',
                stops: stops,
                polygonBarriers : polution
            };

            $http.jsonp(_directionUrl + "?f=json&callback=JSON_CALLBACK", { params : params })
                .then(function(json) {

                    if(json && json.data && json.data.routes && json.data.routes && json.data.routes.features && json.data.routes.features[0] && json.data.routes.features[0].geometry  && json.data.routes.features[0].geometry.paths && json.data.routes.features[0].geometry.paths[0]){
                      deferred.resolve(json.data.routes.features[0].geometry.paths[0]);
                    }    

                });



            // Public API here
            return deferred.promise;

        };

        return _direction;

    });
