'use strict';

angular.module('datafestApp')
    .factory('pollution', function(Aire, MainMap, geometry, shData) {


        var _pollution = {};
        var _stations = [];
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

            if (MainMap.objects.heatmap) {
                MainMap.objects.heatmap.setMap(null);
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

            if (!MainMap.objects.heatmap) {
                MainMap.objects.heatmap = new google.maps.visualization.HeatmapLayer({
                    data: heatMapData,
                    dissipating: true,
                    opacity: 0.3
                })
            } else {
                MainMap.objects.heatmap.setData(heatMapData);
            }

            MainMap.objects.heatmap.set('radius', Math.pow(12 / 5, 6));
            MainMap.objects.heatmap.setMap(MainMap.map);
            MainMap.map.setZoom(MainMap.map.getZoom());

            google.maps.event.addDomListener(MainMap.map, 'zoom_changed', function() {
                var zoom = MainMap.map.getZoom() / 5;
                MainMap.objects.heatmap.set('radius', Math.pow(zoom, 6));
            });

            geometry.fillAvoidBoundingBoxes(data);
        };

        _pollution.paintStations = function() {

            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

            _pollution.get(shData.day, shData.pollutionParameter, function(data) {

                for (var i = 0; i < data.length; i++) {

                    if (data[i].stationObject) {

                        _stations.push(new google.maps.Marker({
                            position: new google.maps.LatLng(data[i].stationObject.Latitud_D, data[i].stationObject.Longitud_D),
                            title: "Hello World!",
                            icon: iconBase + 'schools_maps.png'
                        }));

                        _stationsInfo.push(data[i]);
                    }
                }

                /*
                <md-option value="01">SULFUR DIOXIDE</md-option>
                                <md-option value="6" >CARBON MONOXIDE</md-option>
                                <md-option value="8" >NITRONGEN DIOXIDE</md-option>
                                <md-option value="10" >SUSPENDED PARTICLES (<10)</md-option>
                                <md-option value="14" >OZONE</md-option>
                */
                for (var i = 0; i < _stations.length; i++) {

                    var _pollutant;
                    switch (_stationsInfo[i].parameter) {
                        case 6:
                            _pollutant = "Carbon Monoxide";
                        case 8:
                            _pollutant = "Nitrogen Dioxide";
                        case 10:
                            _pollutant = "Suspended Particles";
                        case 14:
                            _pollutant = "Ozone";
                    }

                    var content = '<div id="content">' +
                        '<div id="siteNotice">' +
                        '</div>' +
                        '<h3 id="firstHeading" class="firstHeading">' + _stationsInfo[i].stationObject.Name + ' Pollution Station</h3>' +
                        '<div id="bodyContent">' +
                        '<p><b>' + _stationsInfo[i].stationObject.Name + '</b>, is collecting ' + _stationsInfo[i].value +
                        ' of ' + _pollutant + ' pollutant</p>' +
                        '</div>' +
                        '</div>';

                    var infowindow = new google.maps.InfoWindow();

                    google.maps.event.addListener(_stations[i], 'click', (function(_station, content, infowindow) {
                        return function() {
                            if (_openedInfoWindow) {
                                _openedInfoWindow.close();
                            }
                            _openedInfoWindow = infowindow;
                            infowindow.setContent(content);
                            infowindow.open(MainMap.map, _station);
                        };
                    })(_stations[i], content, infowindow));

                    _stations[i].setMap(MainMap.map);

                }


            });


        }

        return _pollution;

    });
