'use strict';

angular.module('datafestApp')
    .factory('weather', function($rootScope, MainMap) {

        var _weather = {};

        var _weatherLayer;
        var _cloudLayer;

        _weather.toggleWeather = function( p_active ) {

            if ( p_active ) {

                _weatherLayer = (!_weatherLayer) ? new google.maps.weather.WeatherLayer({
                    temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
                }) : _weatherLayer;

                _cloudLayer = (!_cloudLayer) ? new google.maps.weather.CloudLayer() : _cloudLayer;

                _weatherLayer.setMap(MainMap.map);
                _cloudLayer.setMap(MainMap.map);

                MainMap.map.setZoom(12);

            } else if (_cloudLayer && _weatherLayer) {

                _cloudLayer.setMap(null);
                _weatherLayer.setMap(null);

            }
        }

        return _weather;

    });
