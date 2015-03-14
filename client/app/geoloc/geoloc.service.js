'use strict';

angular.module('datafestApp')
    .factory('geoloc', function($rootScope, MainMap) {

        var _geoloc = {};

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


        _geoloc.GoToRealPos = function(p_callback) {

            geoloc(function(p_data) {

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(p_data.k, p_data.D);
                geocoder.geocode({
                    'latLng': latlng
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $rootScope.directions.origin = results[1].formatted_address;
                            $rootScope.directions.destination = $rootScope.directions.origin;
                            MainMap.calcRoute($rootScope.directions.origin, $rootScope.directions.destination);
                        }
                    } else {

                    }
                });

            });

        };

        var secureApply = function() {
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        }

        return _geoloc;

    });
