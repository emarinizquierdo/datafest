'use strict';

angular.module('datafestApp')
    .factory('pollution', function(Aire, MainMap) {
        

        var _pollution = {};

        var heatmap = null;

        _pollution.get = function(p_date, p_pollution_parameter, p_callback) {

            var heatMapData = [];

            Aire.query({
                    id: p_date.getTime(),
                    parameter: p_pollution_parameter
                }, function(data) {

                    if (heatmap) {
                        heatmap.setMap(null);
                    }

                    for (var i = 0; i < data.length; i++) {

                        if (data && data[i] && data[i].stationObject) {

                            var _weighted = {
                                location: new google.maps.LatLng(data[i].stationObject.Latitud_D, data[i].stationObject.Longitud_D),
                                weight: data[i].value
                            }

                            heatMapData.push(_weighted);
                        }
                    }

                    if (!heatmap) {
                        heatmap = new google.maps.visualization.HeatmapLayer({
                            data: heatMapData,
                            dissipating: true,
                            opacity: 0.3
                        })
                    } else {
                        heatmap.setData(heatMapData);
                    }

                    heatmap.setMap(MainMap.map);
                    MainMap.map.setZoom(MainMap.map.getZoom());
                    heatmap.set('radius', Math.pow(12 / 5, 6));
                    
                    google.maps.event.addDomListener(MainMap.map, 'zoom_changed', function() {
                        var zoom = MainMap.map.getZoom() / 5;
                        heatmap.set('radius', Math.pow(zoom, 6));
                    });

                    if(p_callback){
                        p_callback(data);
                    }

                },
                function(error) {

                });

        }

        return _pollution;


    });
