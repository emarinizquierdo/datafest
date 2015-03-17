'use strict';

angular.module('datafestApp')
    .controller('MainCtrl', function($rootScope, $scope, $http, $mdBottomSheet, $interval, MainMap, shData, Aire, directions, polution, weather, geoloc, toxic, route, geometry) {

        var polyline;
        var weatherLayer;
        var cloudLayer;
        var heatmap;

        $rootScope.directions = {
            origin: null,
            destination: null
        };

        $scope.weatherButtonActive = false;
        $scope.pollutionButtonActive = false;

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

        $scope.shData.updateDay = function() {
            $scope.pollutionButtonActive = true;
            _askForPollution($scope.shData.day, $scope.shData.pollutionParameter);
        }

        function computeTotalDistance(result) {

            var total = 0;

            var myroute = result.getDirections().routes[0];
            for (var i = 0; i < myroute.legs.length; i++) {
                total += myroute.legs[i].distance.value;
            }
            total = total / 1000.0;
            $scope.distance = total;

            $rootScope.directions.origin = result.directions.routes[0].legs[0].start_address;
            $rootScope.directions.destination = result.directions.routes[0].legs[0].end_address;

            route.getRoute({
                originLat: result.directions.routes[0].legs[0].start_location.k,
                originLong: result.directions.routes[0].legs[0].start_location.D,
                destinationLat: result.directions.routes[0].legs[0].end_location.k,
                destinationLong: result.directions.routes[0].legs[0].end_location.D
            }).then(function(p_route) {
                route.paintLine(p_route, geometry.avoidBoundingBoxes);
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

                _askForPollution($scope.shData.day, $scope.shData.pollutionParameter);


            } else if (heatmap) {

                heatmap.setMap(null);

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

        var _askForPollution = function(p_date, p_pollution_parameter) {

            var heatMapData = [];

            Aire.query({
                    id: p_date.getTime(),
                    parameter: p_pollution_parameter
                }, function(data) {

                    if (heatmap) {
                        heatmap.setMap(null);
                    }

                    for (var i = 0; i < data.length; i++) {

                        if (data && data[i] && data[i].stationObject) {

                            var _weighted = {
                                location: new google.maps.LatLng(data[i].stationObject.Latitud_D, data[i].stationObject.Longitud_D),
                                weight: data[i].value
                            }

                            geometry.paintRectangle({
                                lat: data[i].stationObject.Latitud_D,
                                long: data[i].stationObject.Longitud_D
                            }, 8000 * data[i].value);

                            heatMapData.push(_weighted);
                        }
                    }

                    geometry.fillAvoidBoundingBoxes(data);

                    if (!heatmap) {
                        heatmap = new google.maps.visualization.HeatmapLayer({
                            data: heatMapData,
                            dissipating: true,
                            opacity: 0.3
                        })
                    } else {
                        heatmap.setData(heatMapData);
                    }

                    MainMap.map.setZoom(12);
                    heatmap.setMap(MainMap.map);
                    heatmap.set('radius', Math.pow(12 / 5, 6));

                    google.maps.event.addDomListener(MainMap.map, 'zoom_changed', function() {
                        var zoom = MainMap.map.getZoom() / 5;
                        heatmap.set('radius', Math.pow(zoom, 6));
                    });
                },
                function(error) {

                });

        }

        var _rotateToxicElement = function() {
            $scope.toxicElement = ($scope.toxicElement > 4) ? 1 : $scope.toxicElement + 1;
        };


        $interval(_rotateToxicElement, 6000);


        MainMap.initialize();
        MainMap.addEventHandler(MainMap.objects.directionsDisplay, function() {
            computeTotalDistance(MainMap.objects.directionsDisplay);
        })


        /* Interfaces */
        $scope.toggleWeather = weather.toggleWeather;
        $scope.GoToRealPos = geoloc.GoToRealPos;
        $scope.calcRoute = MainMap.calcRoute;
    });
