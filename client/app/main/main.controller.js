'use strict';

angular.module('datafestApp')
    .controller('MainCtrl', function($scope, $http) {

        var cities = [{
            city: 'Madrid',
            desc: 'This is the best city in the world!',
            lat: 40.4378271,
            long: -3.6795366
        }, ];

        var i;

        var rendererOptions = {
            draggable: true
        };
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
        var directionsService = new google.maps.DirectionsService();

        var spain = new google.maps.LatLng(40.4378271, -3.6795366);


        function initialize() {

            var mapOptions = {
                zoom: 14,
                center: spain,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            }

            $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            directionsDisplay.setMap($scope.map);

            google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
                computeTotalDistance(directionsDisplay.getDirections());
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

        $scope.calcRoute = function(p_origin, p_destination){

            if (!p_origin || !p_destination) return;

            var request = {
                origin: p_origin,
                destination: p_destination,
                waypoints: [],
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
            var myroute = result.routes[0];
            for (var i = 0; i < myroute.legs.length; i++) {
                total += myroute.legs[i].distance.value;
            }
            total = total / 1000.0;
            $scope.distance = total;
            secureApply();
        }

        var secureApply = function() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        initialize();

    });
