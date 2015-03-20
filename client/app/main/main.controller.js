'use strict';

angular.module('datafestApp')
    .controller('MainCtrl', function($rootScope, $scope, $http, $mdBottomSheet, $interval, MainMap, shData, Aire, pollution, weather, geoloc, toxic, route, geometry) {

        var weatherLayer;
        var cloudLayer;

        $rootScope.directions = {
            origin: null,
            destination: null
        };

        $scope.weatherButtonActive = false;
        $scope.pollutionButtonActive = true;

        /* Shared Data */
        $scope.shData = shData;

        $scope.shData.day = new Date();
        $scope.shData.day.setHours($scope.shData.day.getHours() - 2);
        $scope.shData.day.setMinutes(0);
        $scope.shData.day.setSeconds(0);
        $scope.shData.day.setMilliseconds(0);

        $scope.shData.pollutionParameter = 6;

        $scope.toxic = toxic;
        $scope.travelMode = MainMap.travelMode;
        $scope.toxicElement = 1;

        $scope.distanceInfo = route.distanceInfo;

        $scope.shData.updateDay = function() {
            $scope.pollutionButtonActive = true;
            pollution.get($scope.shData.day, $scope.shData.pollutionParameter);
        }

        function computeTotalDistance(result) {

            var total = 0;
            var points = [];

            var myroute = result.getDirections().routes[0];
            for (var i = 0; i < myroute.legs.length; i++) {
                total += myroute.legs[i].distance.value;
            }
            total = total / 1000.0;
            $scope.distance = total;


            $rootScope.directions.origin = result.directions.routes[0].legs[0].start_address;
            points.push({
                lat: result.directions.routes[0].legs[0].start_location.k,
                long: result.directions.routes[0].legs[0].start_location.D
            });

            if (result.directions.routes[0].legs[0].via_waypoints && (result.directions.routes[0].legs[0].via_waypoints.length > 0)) {
                for (var i = 0; i < result.directions.routes[0].legs[0].via_waypoints.length; i++) {
                    points.push({
                        lat: result.directions.routes[0].legs[0].via_waypoints[i].k,
                        long: result.directions.routes[0].legs[0].via_waypoints[i].D
                    });
                }
            }

            $rootScope.directions.destination = result.directions.routes[0].legs[0].end_address;
            points.push({
                lat: result.directions.routes[0].legs[0].end_location.k,
                long: result.directions.routes[0].legs[0].end_location.D
            });

            route.getRoute(points, geometry.avoidBoundingBoxes).then(function(p_route) {
                route.paintLine(p_route);
            });

            secureApply();

        }

        var secureApply = function() {
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        }

        $scope.togglePollution = function() {

            if ($scope.pollutionButtonActive) {

                pollution.get($scope.shData.day, $scope.shData.pollutionParameter, _paintPollution);


            } else if (MainMap.objects.heatmap) {

                geometry.deleteRectangles();
                MainMap.objects.heatmap.setMap(null);

            }
        }

        $scope.showGridBottomSheet = function($event) {
            $mdBottomSheet.show({
                templateUrl: 'app/sheet/sheet.html',
                controller: 'SheetCtrl',
                targetEvent: $event
            }).then(function(clickedItem) {

            });
        };

        $scope.changeTravelMode = function() {
            MainMap.travelMode = $scope.travelMode;
            MainMap.calcRoute($rootScope.directions.origin, $rootScope.directions.destination);
        };



        var _paintPollution = function(data) {

            MainMap.calcRoute($rootScope.directions.origin, $rootScope.directions.destination);

            geometry.paintRectangle(data);

            geometry.fillAvoidBoundingBoxes(data);

        }

        var _rotateToxicElement = function() {
            $scope.toxicElement = ($scope.toxicElement > 4) ? 1 : $scope.toxicElement + 1;
        };


        $interval(_rotateToxicElement, 6000);


        MainMap.initialize(function(){

            pollution.get($scope.shData.day, $scope.shData.pollutionParameter);

        });

        MainMap.addEventHandler(MainMap.objects.directionsDisplay, function() {
            computeTotalDistance(MainMap.objects.directionsDisplay);
        })


        /* Interfaces */
        $scope.toggleWeather = weather.toggleWeather;
        $scope.GoToRealPos = geoloc.GoToRealPos;
        $scope.calcRoute = MainMap.calcRoute;
    });
