'use strict';

angular.module('datafestApp')
    .factory('route', function($rootScope, $q, $http, MainMap) {

        var _route = {};

        // p_direction = { originLat, originLong, destinationLat, destinationLong }
        var _routeUrl = "http://route.cit.api.here.com/routing/7.2/calculateroute.json",
            _appId = "gYYYj0sjcHChxWFG7b9f",
            _appCode = "EhIhftLkqN7LEVv7bYld4g";

        var _line;

        _route.distanceInfo = {
            distance: 0,
            time: 0,
        };

        _route.getRoute = function(p_direction, p_avoidArea) {

            var deferred = $q.defer();

            var _waypoint0 = "geo!" + p_direction.originLat + "," + p_direction.originLong,
                _waypoint1 = "geo!" + p_direction.destinationLat + "," + p_direction.destinationLong,
                _mode = "fastest;pedestrian";

            var params = {
                app_id: _appId,
                app_code: _appCode,
                waypoint0: _waypoint0,
                waypoint1: _waypoint1,
                mode: _mode
            };

            if (p_avoidArea) {
                params.avoidareas = p_avoidArea.join('!');
            }

            $http.jsonp(_routeUrl + "?jsonCallback=JSON_CALLBACK", {
                    params: params
                })
                .then(function(json) {

                    if (json && json.data && json.data.response && json.data.response &&
                        json.data.response.route && json.data.response.route[0] && json.data.response.route[0].leg &&
                        json.data.response.route[0].leg[0] && json.data.response.route[0].leg[0].maneuver) {
                        _route.distanceInfo.distance = json.data.response.route[0].summary.distance / 1000;
                        _route.distanceInfo.time = Math.floor(json.data.response.route[0].summary.travelTime / 60);
                        deferred.resolve(json.data.response.route[0].leg[0].maneuver);
                    }

                });



            // Public API here
            return deferred.promise;

        };

        _route.paintLine = function(p_path) {

            var flightPlanCoordinates = [];
            var i;

            for (i = 0; i < p_path.length; i++) {
                flightPlanCoordinates.push(new google.maps.LatLng(p_path[i].position.latitude, p_path[i].position.longitude));
            }

            if (_line) {
                _line.setMap(null);
            }

            _line = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#00CC00',
                strokeOpacity: 0.6,
                strokeWeight: 6
            });

            _line.setMap(MainMap.map);

            var zoomToObject = function(obj) {

                var bounds = new google.maps.LatLngBounds();
                var points = obj.getPath().getArray();
                for (var n = 0; n < points.length; n++) {
                    bounds.extend(points[n]);
                }

                MainMap.map.fitBounds(bounds);
            }

            zoomToObject(_line);

        };

        var secureApply = function() {
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        }

        return _route;

    });
