'use strict';

angular.module('datafestApp')
    .factory('route', function($rootScope, $q, $http, $mdToast, MainMap, geometry) {

        var _route = {};

        // p_direction = { originLat, originLong, destinationLat, destinationLong }
        var _routeUrl = "https://route.cit.api.here.com/routing/7.2/calculateroute.json",
            _appId = "gYYYj0sjcHChxWFG7b9f",
            _appCode = "EhIhftLkqN7LEVv7bYld4g";

        MainMap.objects.line;

        _route.distanceInfo = {
            distance: 0,
            time: 0,
        };

        _route.getRoute = function(p_direction, p_avoidArea) {

            var deferred = $q.defer();

            var _mode = "fastest;pedestrian";

            var params = {
                app_id: _appId,
                app_code: _appCode,
                mode: _mode
            };

            for (var i = 0; i < p_direction.length; i++) {
                params["waypoint" + i] = "geo!" + p_direction[i].lat + "," + p_direction[i].long;
            }

            if (p_avoidArea) {
                params.avoidareas = p_avoidArea.join('!');
            }

            $http.jsonp(_routeUrl + "?jsonCallback=JSON_CALLBACK", {
                    params: params
                })
                .then(function(json) {

                    var _tempRoute = [];

                    if (json && json.data && json.data.response && json.data.response &&
                        json.data.response.route && json.data.response.route[0] && json.data.response.route[0].leg) {

                        _route.distanceInfo.distance = json.data.response.route[0].summary.distance / 1000;
                        _route.distanceInfo.time = Math.floor(json.data.response.route[0].summary.travelTime / 60);

                        _route.distanceInfo.time = (_route.distanceInfo.time > 60) ? _route.distanceInfo.time/60 + " hours" : _route.distanceInfo.time + " minutes";

                        for (var i = 0; i < json.data.response.route[0].leg.length; i++) {
                            if (json.data.response.route[0].leg[i] && json.data.response.route[0].leg[i].maneuver) {
                                _tempRoute = _tempRoute.concat(json.data.response.route[0].leg[i].maneuver);
                            }

                        }

                        deferred.resolve(_tempRoute);

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

            if (MainMap.objects.line) {
                MainMap.objects.line.setMap(null);
            }

            MainMap.objects.line = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#00CC00',
                strokeOpacity: 0.6,
                strokeWeight: 6
            });

            MainMap.objects.line.setMap(MainMap.map);

            var zoomToObject = function(obj) {

                var bounds = new google.maps.LatLngBounds();
                var points = obj.getPath().getArray();
                for (var n = 0; n < points.length; n++) {
                    bounds.extend(points[n]);
                }

                MainMap.map.fitBounds(bounds);
            }

            zoomToObject(MainMap.objects.line);

        };

        _route.getCircular = function(p_distance) {

            var points = [];
            var pointsObject = [];
            var _randomInitialDegree = Math.floor(Math.random() * 360);

            if (!MainMap.objects.circularPoint.position) {

                $mdToast.show(
                    $mdToast.simple()
                    .content('Please, touch twice the map before to set a point')
                    .position('bottom left')
                    .hideDelay(3000)
                );

                return;

            }

            points[0] = new google.maps.LatLng(MainMap.objects.circularPoint.position.k, MainMap.objects.circularPoint.position.D); // Circle center
            var radius = p_distance / 6; // 10km

            pointsObject[0] = {
                lat: points[0].k,
                long: points[0].D
            };

            for (var i = 1; i < 5; i++) {

                // Show marker at destination point
                new google.maps.Marker({
                    position: points[i],
                    map: MainMap.map
                });

                points[i] = points[i - 1].destinationPoint(_randomInitialDegree * i, radius);
                pointsObject[i] = {
                    lat: points[i].k,
                    long: points[i].D
                };

                _randomInitialDegree = 90;

            }

            pointsObject[4] = pointsObject[0]

            _route.getRoute(pointsObject, geometry.avoidBoundingBoxes).then(function(p_route) {
                _route.paintLine(p_route);
            });

        };

        return _route;

    });
