'use strict';

angular.module('datafestApp')
    .factory('bicimad', function(MainMap) {

        var _bicimad = {};

        var _biciMadLayer,
            _biciParkLayer,
            _quietStreetsLayer,
            _cycloLaneLayer,
            _cycloViaLayer,
            _pollutionStationLayer;

        var _bicimadUrl = 'http://datos.madrid.es/egob/catalogo/207431-0-bicicletas-bicimad-mapa.kml',
            _biciParkUrl = 'http://urbandatafest.mybluemix.net/assets/tranquilas.kml',
            _quietStreetsUrl = 'http://datos.madrid.es/egob/catalogo/205115-4-calles-tranquilas.kml',
            _cycloLaneUrl = 'http://datos.madrid.es/egob/catalogo/209388-2-bici-ciclocarriles.kml',
            _cycloViaUrl = 'http://datos.madrid.es/egob/catalogo/205107-2-vias-ciclistas.kml';

        _bicimad.toggleBiciMad = function(p_status) {

            _biciMadLayer = _toggle(_biciMadLayer, _bicimadUrl, p_status);
        };

        _bicimad.toggleBicipark = function(p_status) {

            _biciParkLayer = _toggle(_biciParkLayer, _biciParkUrl, p_status);
        };

        _bicimad.toggleQuietStreets = function(p_status) {

            _quietStreetsLayer = _toggle(_quietStreetsLayer, _quietStreetsUrl, p_status);
        };

        _bicimad.toggleCycloLane = function(p_status) {

            _cycloLaneLayer = _toggle(_cycloLaneLayer, _cycloLaneUrl, p_status);
        };

        _bicimad.toggleCycloVia = function(p_status) {

            _cycloViaLayer = _toggle(_cycloViaLayer, _cycloViaUrl, p_status);
        };

        _bicimad.togglePollutionStations = function( p_status ){

            MainMap.objects.pollutionStationsStatus = p_status;
            
            if (p_status) {

                for(var i = 0; i < MainMap.objects.stations.length; i++){
                    MainMap.objects.stations[i].setMap(MainMap.map);
                }

                MainMap.map.setZoom(12);

            }else{

                for(var i = 0; i < MainMap.objects.stations.length; i++){
                    MainMap.objects.stations[i].setMap(null);
                }

            }

        }
        
        function _toggle(p_layer, p_url, p_status) {

            if (p_status) {

                p_layer = (!p_layer) ? new google.maps.KmlLayer({
                    url: p_url
                }) : p_layer;

                p_layer.setMap(MainMap.map);
                MainMap.map.setZoom(12);

            } else if (p_layer) {
                p_layer.setMap(null);

            }

            return p_layer;
        }


        return _bicimad;
    });
