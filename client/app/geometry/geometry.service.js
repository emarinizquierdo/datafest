'use strict';

angular.module('datafestApp')
    .factory('geometry', function(MainMap) {

        var _geometry = {};

        var _avoidBoundingBoxes = [];

        _geometry.calcBounds = function(center, size) {

            var n = google.maps.geometry.spherical.computeOffset(center, size.height / 2, 0).lat(),
                s = google.maps.geometry.spherical.computeOffset(center, size.height / 2, 180).lat(),
                e = google.maps.geometry.spherical.computeOffset(center, size.width / 2, 90).lng(),
                w = google.maps.geometry.spherical.computeOffset(center, size.width / 2, 270).lng();
            return new google.maps.LatLngBounds(new google.maps.LatLng(s, w),
                new google.maps.LatLng(n, e))

        };
        //_avoidBoundingBoxes.push(
        _geometry.paintRectangle = function(p_center, p_size) {
            new google.maps.Rectangle({
                bounds: _geometry.calcBounds(new google.maps.LatLng(p_center.lat, p_center.long),
                    new google.maps.Size(p_size, p_size)),
                map: MainMap.map,
                fillColor: '#e73827',
                strokeWeight: 0
            });
        };

        _geometry.fillAvoidBoundingBoxes = function(p_stations) {
            _avoidBoundingBoxes = [];
            for (var i = 0; i < p_stations.length; i++) {
                if (p_stations && p_stations[i] && p_stations[i].stationObject) {
                    var _boundbox = _geometry.calcBounds(new google.maps.LatLng(
                        p_stations[i].stationObject.Latitud_D,
                        p_stations[i].stationObject.Longitud_D
                    ), new google.maps.Size(8000 * p_stations[i].value, 8000 * p_stations[i].value));
                    _avoidBoundingBoxes.push('' + _boundbox.Ca.j + ',' + _boundbox.va.j + ';' + _boundbox.Ca.k + ',' + _boundbox.va.k);
                }
            }
        }

        _geometry.avoidBoundingBoxes = _avoidBoundingBoxes;
        
        return _geometry;

    });
