'use strict';

angular.module('datafestApp')
    .factory('geometry', function(MainMap) {

        var _geometry = {};
        var _rectangles = [];

        _geometry.calcBounds = function(center, size) {

            var n = google.maps.geometry.spherical.computeOffset(center, size.height / 2, 0).lat(),
                s = google.maps.geometry.spherical.computeOffset(center, size.height / 2, 180).lat(),
                e = google.maps.geometry.spherical.computeOffset(center, size.width / 2, 90).lng(),
                w = google.maps.geometry.spherical.computeOffset(center, size.width / 2, 270).lng();
            return new google.maps.LatLngBounds(new google.maps.LatLng(s, w),
                new google.maps.LatLng(n, e))

        };
        //_avoidBoundingBoxes.push(
        _geometry.paintRectangle = function(p_centers) {

            _geometry.deleteRectangles();
            if (window.paintRectangles) {
                for (var i = 0; i < p_centers.length; i++) {
                    if (p_centers && p_centers[i] && p_centers[i].stationObject) {

                        _rectangles[i] = (!_rectangles[i]) ? new google.maps.Rectangle({
                            bounds: _geometry.calcBounds(new google.maps.LatLng(p_centers[i].stationObject.Latitud_D, p_centers[i].stationObject.Longitud_D),
                                new google.maps.Size(8000 * p_centers[i].value, 8000 * p_centers[i].value)),
                            fillColor: '#e73827',
                            strokeWeight: 0
                        }) : _rectangles[i];

                        _rectangles[i].setMap(MainMap.map);
                    }
                }
            }

        };

        _geometry.deleteRectangles = function() {
            if (_rectangles.length > 0) {
                for (var i = 0; i < _rectangles.length; i++) {
                    if (_rectangles[i]) {
                        _rectangles[i].setMap(null);
                    }
                }
            }
            _rectangles = [];
        }
        _geometry.avoidBoundingBoxes = [];

        _geometry.fillAvoidBoundingBoxes = function(p_stations) {
            _geometry.avoidBoundingBoxes = [];
            for (var i = 0; i < p_stations.length; i++) {
                if (p_stations && p_stations[i] && p_stations[i].stationObject) {
                    var _boundbox = _geometry.calcBounds(new google.maps.LatLng(
                        p_stations[i].stationObject.Latitud_D,
                        p_stations[i].stationObject.Longitud_D
                    ), new google.maps.Size(8000 * p_stations[i].value, 8000 * p_stations[i].value));
                    _geometry.avoidBoundingBoxes.push('' + _boundbox.Ca.j + ',' + _boundbox.va.j + ';' + _boundbox.Ca.k + ',' + _boundbox.va.k);
                }
            }
        }

        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        }

        Number.prototype.toDeg = function() {
            return this * 180 / Math.PI;
        }

        _geometry.destinationPoint = function(brng, dist) {

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

        return _geometry;

    });
