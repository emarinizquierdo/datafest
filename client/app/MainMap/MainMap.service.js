'use strict';

angular.module('datafestApp')
    .factory('MainMap', function($rootScope, toxic) {

        // Main Object
        var _map = {};

        /*
         * Common and private vars
         */

        //Madrid
        var madrid = new google.maps.LatLng(40.4378271, -3.6795366);

        var mapOptions = {
            zoom: 14,
            center: madrid,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        var rendererOptions = {
            draggable: true
        };

        var _inputOriginSearch,
            _inputDestinationSearch;

        //Google Maps Controller
        _map.map = null;

        _map.objects = {
            directionsDisplay: new google.maps.DirectionsRenderer(rendererOptions),
            directionsService: new google.maps.DirectionsService()
        };

        _map.travelMode = google.maps.TravelMode.WALKING;

        _map.initialize = function() {

            _map.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            _map.objects.directionsDisplay.setMap(_map.map);

            initSearchInputsBind();

            toxic.get();

        };

        _map.addEventHandler = function(p_event, p_handler) {

            google.maps.event.addListener(p_event, 'directions_changed', function() {
                p_handler(p_event);
            });

        }

        _map.calcRoute = function(p_origin, p_destination) {

            if (!p_origin || !p_destination) return;

            $rootScope.directions.origin = p_origin;
            $rootScope.directions.destination = p_destination;

            var request = {
                origin: p_origin,
                destination: p_destination,
                optimizeWaypoints: true,
                provideRouteAlternatives: true,
                travelMode: _map.travelMode
            };

            _map.objects.directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    _map.objects.directionsDisplay.setDirections(response);
                }
            });

            secureApply();

        }

        _map.setSearchInputs = function(p_origin, p_destination) {

            _inputOriginSearch = p_origin;
            _inputDestinationSearch = p_destination;

        }


        var initSearchInputsBind = function() {

            var _originInput = new google.maps.places.Autocomplete(_inputOriginSearch);
            var _destinationInput = new google.maps.places.Autocomplete(_inputDestinationSearch);

            _originInput.bindTo('bounds', _map.map);
            _destinationInput.bindTo('bounds', _map.map);

            var infowindow = new google.maps.InfoWindow();

            google.maps.event.addListener(_originInput, 'place_changed', function() {
                onChange(_originInput);
            });

            google.maps.event.addListener(_destinationInput, 'place_changed', function() {
                onChange(_destinationInput);
            });

            function onChange(pListener) {

                var place = pListener.getPlace();
                if (!place.geometry) {
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    _map.map.fitBounds(place.geometry.viewport);
                } else {
                    _map.map.setCenter(place.geometry.location);
                    _map.map.setZoom(17); // Why 17? Because it looks good.
                }

                if (pListener == _originInput) {
                    $rootScope.directions.origin = place.formatted_address;
                }

                if (pListener == _destinationInput) {
                    $rootScope.directions.destination = place.formatted_address;
                }

                _map.calcRoute($rootScope.directions.origin, $rootScope.directions.destination);


            }


        }

        var secureApply = function() {
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        }

        return _map;

    });
