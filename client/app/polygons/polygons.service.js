'use strict';

angular.module('datafestApp')
  .factory('polygons', function () {
    

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

  });
