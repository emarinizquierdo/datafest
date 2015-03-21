'use strict';

angular.module('datafestApp')
    .factory('geoloc', function($rootScope, MainMap, $mdToast) {

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

                _geoloc.showPoints(p_data.k, p_data.D);

            });

        };

        _geoloc.showPoints = function(lat, long) {

            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, long);
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
        };

        var _init = function() {
            _geoloc.showPoints(40.4378271, -3.6795366);

            $mdToast.show(
                $mdToast.simple()
                .content('I show you info from Madrid, but you can touch geoloc button to find you. App improved to be seen in Chrome Browsers')
                .position('bottom left')
                .hideDelay(5000)
            );
        }

        _init();
        
        return _geoloc;

    });
