'use strict';

angular.module('datafestApp')
    .controller('MainCtrl', function($scope, $http, directions) {

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

        var flightPath;
        
        /*
                $scope.travelMode = 
        */

        function initialize() {

            var mapOptions = {
                zoom: 14,
                center: spain,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            }

            geoloc(function(p_data) {

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(p_data.k, p_data.D);
                geocoder.geocode({
                    'latLng': latlng
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $scope.origin = results[1].formatted_address;
                            $scope.destination = $scope.origin;
                            $scope.calcRoute($scope.origin, $scope.destination);
                            secureApply();
                        }
                    } else {
                        alert("Geocoder failed due to: " + status);
                    }
                });

            });

            $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            $scope.map2 = new google.maps.Map(document.getElementById('map-canvas2'), mapOptions);

            directionsDisplay.setMap($scope.map);

            google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
                computeTotalDistance(directionsDisplay);
            });

        }



        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function(info) {

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.city
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
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

        $scope.calcRoute = function(p_origin, p_destination) {

            if (!p_origin || !p_destination) return;

            var request = {
                origin: p_origin,
                destination: p_destination,
                //waypoints: cities,
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
            secureApply();

            var _origin = result.directions.routes[0].legs[0].start_location;
            var _destination = result.directions.routes[0].legs[0].end_location;

            var _stops = [{
                "geometry": {
                    "x": _origin.D,
                    "y": _origin.k,
                    "spatialReference": {
                        "wkid": 4326
                    }
                }
            }, {
                "geometry": {
                    "x": _destination.D,
                    "y": _destination.k,
                    "spatialReference": {
                        "wkid": 4326
                    }
                }
            }];
            var _barriers = [{
                "geometry": {
                    "x": -663118.8490270323,
                    "y": 5378882.5637674555,
                    "spatialReference": {
                        "wkid": 102100
                    }
                }
            }];
            directions.getRoute(_stops, _barriers).then(function(paths) {
                paintPolyLine(paths);
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



            flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            flightPath.setMap(null);
            flightPath.setMap($scope.map2);
            zoomToObject(flightPath);

            function zoomToObject(obj) {
                var bounds = new google.maps.LatLngBounds();
                var points = obj.getPath().getArray();
                for (var n = 0; n < points.length; n++) {
                    bounds.extend(points[n]);
                }
                $scope.map2.fitBounds(bounds);
            }

            // $scope.map2.setCenter(flightPlanCoordinates);
        }





        /*

        var mapOptions = {
            zoom: 3,
            center: new google.maps.LatLng(0, -180),
            mapTypeId: google.maps.MapTypeId.TERRAIN
          };

          var map = new google.maps.Map(document.getElementById('map-canvas'),
              mapOptions);

          var flightPlanCoordinates = [
            new google.maps.LatLng(37.772323, -122.214897),
            new google.maps.LatLng(21.291982, -157.821856),
            new google.maps.LatLng(-18.142599, 178.431),
            new google.maps.LatLng(-27.46758, 153.027892)
          ];
          var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });

          flightPath.setMap(map);
        }

        */
        initialize();

    });
