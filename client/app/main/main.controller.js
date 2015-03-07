'use strict';

angular.module('datafestApp')
    .controller('MainCtrl', function($scope, $http, directions, polution) {

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

            _paintPolygons(polution);

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

            directions.getRoute(_stops ).then(function(paths) {
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

            polyline.setMap($scope.map2);

            zoomToObject(polyline);

            function zoomToObject(obj) {
                var bounds = new google.maps.LatLngBounds();
                var points = obj.getPath().getArray();
                for (var n = 0; n < points.length; n++) {
                    bounds.extend(points[n]);
                }
                $scope.map2.fitBounds(bounds);
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

                bermudaTriangle.setMap($scope.map2);

            });

            // Define the LatLng coordinates for the polygon's path.



        }

        initialize();

    });
