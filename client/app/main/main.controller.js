'use strict';

angular.module('datafestApp')
    .controller('MainCtrl', function($rootScope, $scope, $http, $mdBottomSheet, shData, Aire, directions, polution) {

        var cities = [{
            location: new google.maps.LatLng(40.4378271, -3.6795366),
            stopover: false
        }];

        var i;

        var rendererOptions = {
            draggable: true
        };

        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
        var directionsService = new google.maps.DirectionsService();

        var spain = new google.maps.LatLng(40.4378271, -3.6795366);

        var polyline;
        var weatherLayer;
        var cloudLayer;
        var heatmap;

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

            var mapOptions = {
                zoom: 14,
                center: spain,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            }

            $scope.GoToRealPos();

            $rootScope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            directionsDisplay.setMap($rootScope.map);

            google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
                computeTotalDistance(directionsDisplay);
            });

            //_paintPolygons(polution);

        }



        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function(info) {

            var marker = new google.maps.Marker({
                map: $rootScope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.city
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($rootScope.map, marker);
            });

            $scope.markers.push(marker);

        }

        for (i = 0; i < cities.length; i++) {
            createMarker(cities[i]);
        }

        $scope.openInfoWindow = function(e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }

        $rootScope.$watch('origin', function(p_new, p_old) {

            if (p_new && (p_new != p_old)) {
                $scope.calcRoute($rootScope.origin, $rootScope.destination);
            }
        })

        $scope.calcRoute = function(p_origin, p_destination) {

            if (!p_origin || !p_destination) return;

            var request = {
                origin: p_origin,
                destination: p_destination,
                optimizeWaypoints: true,
                provideRouteAlternatives: true,
                travelMode: google.maps.TravelMode.WALKING
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });

        }

        function computeTotalDistance(result) {

            var total = 0;

            var myroute = result.getDirections().routes[0];
            for (var i = 0; i < myroute.legs.length; i++) {
                total += myroute.legs[i].distance.value;
            }
            total = total / 1000.0;
            $scope.distance = total;


            $rootScope.origin = result.directions.routes[0].legs[0].start_address;
            $rootScope.destination = result.directions.routes[0].legs[0].end_address;

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

        $scope.GoToRealPos = function(p_callback) {

            geoloc(function(p_data) {

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(p_data.k, p_data.D);
                geocoder.geocode({
                    'latLng': latlng
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $rootScope.origin = results[1].formatted_address;
                            $rootScope.destination = $rootScope.origin;
                            $scope.calcRoute($rootScope.origin, $rootScope.destination);
                            secureApply();
                        }
                    } else {

                    }
                });

            });

        }

        var secureApply = function() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        var geoloc = function(p_callback) {
            // Try HTML5 geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = new google.maps.LatLng(position.coords.latitude,
                        position.coords.longitude);

                    p_callback(pos);

                });
            }
        }



        var paintPolyLine = function(p_path) {

            var flightPlanCoordinates = [];

            for (i = 0; i < p_path.length; i++) {
                flightPlanCoordinates.push(new google.maps.LatLng(p_path[i][1], p_path[i][0]));
            }

            if (polyline) {
                polyline.setMap(null);
            }


            polyline = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            polyline.setMap($rootScope.map);

            zoomToObject(polyline);

            function zoomToObject(obj) {
                var bounds = new google.maps.LatLngBounds();
                var points = obj.getPath().getArray();
                for (var n = 0; n < points.length; n++) {
                    bounds.extend(points[n]);
                }
                $rootScope.map.fitBounds(bounds);
            }


        }

        var _paintPolygons = function(p_polygons) {

            angular.forEach(p_polygons.features, function(value, key) {

                var triangleCoords = [];

                for (var j = 0; j < value.geometry.rings[0].length; j++) {
                    triangleCoords.push(new google.maps.LatLng(value.geometry.rings[0][j][1], value.geometry.rings[0][j][0]));
                }

                // Construct the polygon.
                var bermudaTriangle = new google.maps.Polygon({
                    paths: triangleCoords,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                });

                bermudaTriangle.setMap($rootScope.map);

            });

            // Define the LatLng coordinates for the polygon's path.



        }



        $scope.toggleWeather = function() {

            if ($scope.weatherButtonActive) {

                weatherLayer = (!weatherLayer) ? new google.maps.weather.WeatherLayer({
                    temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
                }) : weatherLayer;

                weatherLayer.setMap($rootScope.map);

                $rootScope.map.setZoom(12);

                cloudLayer = (!cloudLayer) ? new google.maps.weather.CloudLayer() : cloudLayer;
                cloudLayer.setMap($rootScope.map);

            } else if (cloudLayer && weatherLayer) {

                cloudLayer.setMap(null);
                weatherLayer.setMap(null);

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

                    $rootScope.map.setZoom(12);
                    heatmap.setMap($rootScope.map);
                    heatmap.set('radius', 100);
                },
                function(error) {

                });

        }

        initialize();

    });
