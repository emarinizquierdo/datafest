'use strict';

angular.module('datafestApp')
    .factory('MainMap', function($rootScope, $timeout, toxic) {

        // Main Object
        var _map = {};

        /*
         * Common and private vars
         */

        //Madrid
        var madrid = new google.maps.LatLng(40.4378271, -3.6795366);

        var mapOptions = {
            zoom: 8,
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
            directionsService: new google.maps.DirectionsService(),
            line: null,
            heatmap: null,
            circularPoint: null,
            stations: [],
            selectedIndex: 0,
            pollutionStationsStatus: true
        };

        _map.travelMode = google.maps.TravelMode.WALKING;

        _map.initialize = function(p_callback) {

            _map.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            _map.objects.directionsDisplay.setMap(_map.map);

            $timeout(initSearchInputsBind, 2000);


            toxic.get();

            $rootScope.mapLoaded = true;

            _map.clickHandler();

            p_callback();

            secureApply();

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
                    $rootScope.directions.originLat = (response && response.routes && response.routes[0] &&
                        response.routes[0].legs && response.routes[0].legs[0] && response.routes[0].legs[0].start_location &&
                        response.routes[0].legs[0].start_location.A) ? response.routes[0].legs[0].start_location.A : null;
                    $rootScope.directions.originLong = (response && response.routes && response.routes[0] &&
                        response.routes[0].legs && response.routes[0].legs[0] && response.routes[0].legs[0].start_location &&
                        response.routes[0].legs[0].start_location.F) ? response.routes[0].legs[0].start_location.F : null;
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
                    _map.map.setZoom(12); // Why 17? Because it looks good.
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

        _map.show = function(p_object) {
            if (p_object) {
                p_object.setMap(_map.map);
            }
        }

        _map.hide = function(p_object) {
            if (p_object) {
                p_object.setMap(null);
            }
        };

        _map.clickHandler = function() {

            // create a new marker
            _map.objects.circularPoint = new google.maps.Marker({});
            google.maps.event.addListener(_map.map, 'dblclick', function(event) {
                if (_map.objects.selectedIndex) {
                    _map.objects.circularPoint.setPosition(event.latLng);
                    _map.objects.circularPoint.setMap(_map.map);
                    _map.objects.circularPoint.setAnimation(google.maps.Animation.DROP);
                    _map.objects.line.setMap(null);
                }
            });

        }

        var secureApply = function() {
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        }

        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        }

        Number.prototype.toDeg = function() {
            return this * 180 / Math.PI;
        }

        google.maps.LatLng.prototype.destinationPoint = function(brng, dist) {

            dist = dist / 6371;
            brng = brng.toRad();

            var lat1 = this.lat().toRad(),
                lon1 = this.lng().toRad();

            var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

            var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                Math.cos(lat1),
                Math.cos(dist) - Math.sin(lat1) *
                Math.sin(lat2));

            if (isNaN(lat2) || isNaN(lon2)) return null;

            return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());

        };

        return _map;

    });
