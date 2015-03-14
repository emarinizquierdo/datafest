'use strict';

angular.module('datafestApp')
    .controller('MainCtrl', function($rootScope, $scope, $http, $mdBottomSheet, MainMap, shData, Aire, directions, polution, weather, geoloc) {

        var polyline;
        var weatherLayer;
        var cloudLayer;
        var heatmap;

        $rootScope.directions = {
            origin : null,
            destination : null
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

        $scope.shData.updateDay = function() {
            $scope.pollutionButtonActive = true;
            _askForPollution($scope.shData.day, $scope.shData.pollutionParameter);
        }

        function initialize() {


            $scope.GoToRealPos();


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

            secureApply();
            /*
            var _stops = [{
                "geometry": {
                    "x": $rootScope.origin.D,
                    "y": $rootScope.origin.k,
                    "spatialReference": {
                        "wkid": 4326
                    }
                }
            }, {
                "geometry": {
                    "x": $rootScope.destination.D,
                    "y": $rootScope.destination.k,
                    "spatialReference": {
                        "wkid": 4326
                    }
                }
            }];

            /*directions.getRoute(_stops).then(function(paths) {
                paintPolyLine(paths);
            });*/

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

                            heatMapData.push(_weighted);
                        }
                    }

                    if (!heatmap) {
                        heatmap = new google.maps.visualization.HeatmapLayer({
                            data: heatMapData,
                            opacity: 0.4
                        })
                    } else {
                        heatmap.setData(heatMapData);
                    }

                    MainMap.map.setZoom(12);
                    heatmap.setMap(MainMap.map);
                    heatmap.set('radius', 100);
                },
                function(error) {

                });

        }

        MainMap.initialize();
        MainMap.addEventHandler(MainMap.objects.directionsDisplay, function(){
            computeTotalDistance(MainMap.objects.directionsDisplay);
        })


        /* Interfaces */
        $scope.toggleWeather = weather.toggleWeather;
        $scope.GoToRealPos = geoloc.GoToRealPos;
        $scope.calcRoute = MainMap.calcRoute;
    });
