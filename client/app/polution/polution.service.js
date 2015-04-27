'use strict';

angular.module('datafestApp')
    .factory('pollution', function(Aire, MainMap, geometry, shData) {


        var _pollution = {};
        var _stationsInfo = [];
        var _infowindow = [];
        var _openedInfoWindow = null;

        _pollution.get = function(p_date, p_pollution_parameter, p_callback) {

            Aire.query({
                    id: p_date.getTime(),
                    parameter: p_pollution_parameter
                }, function(data) {

                    if (p_callback) {
                        p_callback(data);
                    }

                },
                function(error) {

                });

        }


        _pollution.paintHeatmap = function(data) {

            var heatMapData = [];
            var _maxIntensity;

            if (MainMap.objects.heatmap) {
                MainMap.objects.heatmap.setMap(null);
            }

            for (var i = 0; i < data.length; i++) {

                if (data && data[i] && data[i].stationObject) {

                    var _weighted = {
                        location: new google.maps.LatLng(data[i].stationObject.Latitud_D, data[i].stationObject.Longitud_D),
                        weight: data[i].value
                    }

                    _maxIntensity = data[i].parameter;

                    heatMapData.push(_weighted);
                }
            }

            _maxIntensity = (_maxIntensity == 6) ? 15 :
                (_maxIntensity == 8) ? 300 :
                (_maxIntensity == 12) ? 150 :
                (_maxIntensity == 14) ? 120 :
                525;

            if (!MainMap.objects.heatmap) {
                MainMap.objects.heatmap = new google.maps.visualization.HeatmapLayer({
                    data: heatMapData,
                    dissipating: true,
                    opacity: 0.3,
                    maxIntensity: _maxIntensity
                })
            } else {
                //MainMap.objects.heatmap.setData(heatMapData);
            }

            MainMap.objects.heatmap.set('radius', Math.pow(12 / 5, 6));
            MainMap.objects.heatmap.setMap(MainMap.map);
            MainMap.map.setZoom(MainMap.map.getZoom());
            /* Bug
            google.maps.event.addDomListener(MainMap.map, 'zoom_changed', function() {
                var zoom = MainMap.map.getZoom() / 5;
                MainMap.objects.heatmap.set('radius', Math.pow(zoom, 6));
            });*/

            geometry.fillAvoidBoundingBoxes(data);
        };

        _pollution.paintStations = function() {

            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

            _pollution.get(shData.day, shData.pollutionParameter, function(data) {

                for (var i = 0; i < MainMap.objects.stations.length; i++) {
                    MainMap.objects.stations[i].setMap(null);
                }

                MainMap.objects.stations = [];
                _stationsInfo = [];

                for (var i = 0; i < data.length; i++) {

                    if (data[i].stationObject) {

                        MainMap.objects.stations.push(new google.maps.Marker({
                            position: new google.maps.LatLng(data[i].stationObject.Latitud_D, data[i].stationObject.Longitud_D),
                            title: data[i].stationObject.Name,
                            icon: 'https://chart.googleapis.com/chart?chst=d_text_outline&chld=ffffff|10|h|000000|_|' + data[i].value + 'μg/m3'
                        }));

                        _stationsInfo.push(data[i]);
                    }
                }

                for (var i = 0; i < MainMap.objects.stations.length; i++) {

                    var _pollutant;
                    switch (_stationsInfo[i].parameter) {
                        case 1:
                            _pollutant = "Sulfur Dioxide";
                            break
                        case 6:
                            _pollutant = "Carbon Monoxide";
                            break
                        case 8:
                            _pollutant = "Nitrogen Dioxide";
                            break
                        case 10:
                            _pollutant = "Suspended Particles";
                            break
                        case 14:
                            _pollutant = "Ozone";
                            break
                    }

                    var content = '<div id="content">' +
                        '<div id="siteNotice">' +
                        '</div>' +
                        '<h3 id="firstHeading" class="firstHeading">' + _stationsInfo[i].stationObject.Name + ' Pollution Station</h3>' +
                        '<div id="bodyContent">' +
                        '<p><b>' + _stationsInfo[i].stationObject.Name + '</b>, is collecting ' + _stationsInfo[i].value +
                        ' μg/m3 of ' + _pollutant + ' pollutant</p>' +
                        '</div>' +
                        '</div>';

                    var infowindow = new google.maps.InfoWindow();

                    google.maps.event.addListener(MainMap.objects.stations[i], 'click', (function(_station, content, infowindow) {
                        return function() {
                            if (_openedInfoWindow) {
                                _openedInfoWindow.close();
                            }
                            _openedInfoWindow = infowindow;
                            infowindow.setContent(content);
                            infowindow.open(MainMap.map, _station);
                        };
                    })(MainMap.objects.stations[i], content, infowindow));

                }

                if (MainMap.objects.pollutionStationsStatus) {
                    for (var i = 0; i < MainMap.objects.stations.length; i++) {
                        MainMap.objects.stations[i].setMap(MainMap.map);
                    }
                }

            });


        }

        return _pollution;

    });
