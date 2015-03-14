'use strict';

angular.module('datafestApp')
    .factory('toxic', function(Aire) {

        var _toxic = {};

        _toxic.dioxido = {
            value: 0
        };
        _toxic.monoxido = {
            value: 0
        };
        _toxic.dioxnit = {
            value: 0
        };
        _toxic.particulas = {
            value: 0
        };
        _toxic.ozono = {
            value: 0
        };

        var day = new Date();

        day.setHours(day.getHours() - 2);
        day.setMinutes(0);
        day.setSeconds(0);
        day.setMilliseconds(0);

        _toxic.get = function() {

            Aire.query({
                    id: day.getTime(),
                    parameter: [1, 6, 8, 10, 14]
                }, function(data) {

                    for (var i = 0; i < data.length; i++) {

                        switch (data[i].parameter) {
                            case 1:
                                _toxic.dioxido.value = data[i].value;
                                _toxic.dioxido.color = (0 <= _toxic.dioxido.value <= 175) ? 
                                '#4CAF50' : (176 <= _toxic.dioxido.value <= 350)?
                                '#FFEB3B' : (351 <= _toxic.dioxido.value <= 525) ?
                                '#FF9800' : '#F44336';
                            case 6:
                                _toxic.monoxido.value = data[i].value;
                                _toxic.monoxido.color = (0 <= _toxic.monoxido.value <= 5) ? 
                                '#4CAF50' : (6 <= _toxic.monoxido.value <= 10)?
                                '#FFEB3B' : (11 <= _toxic.monoxido.value <= 15) ?
                                '#FF9800' : '#F44336';
                            case 8:
                                _toxic.dioxnit.value = data[i].value;
                                _toxic.dioxnit.color = (0 <= _toxic.dioxnit.value <= 100) ? 
                                '#4CAF50' : (101 <= _toxic.dioxnit.value <= 200)?
                                '#FFEB3B' : (201 <= _toxic.dioxnit.value <= 300) ?
                                '#FF9800' : '#F44336';
                            case 10:
                                _toxic.particulas.value = data[i].value;
                                _toxic.particulas.color = (0 <= _toxic.particulas.value <= 50) ? 
                                '#4CAF50' : (51 <= _toxic.particulas.value <= 90)?
                                '#FFEB3B' : (91 <= _toxic.particulas.value <= 150) ?
                                '#FF9800' : '#F44336';
                            case 14:
                                _toxic.ozono.value = data[i].value;
                                _toxic.ozono.color = (0 <= _toxic.ozono.value <= 90) ? 
                                '#4CAF50' : (91 <= _toxic.ozono.value <= 180)?
                                '#FFEB3B' : (181 <= _toxic.ozono.value <= 240) ?
                                '#FF9800' : '#F44336';

                        }

                    }


                },
                function(error) {

                });
        };

        return _toxic;

    });
/*
<md-option value="01">DIÓXIDO DE AZUFRE</md-option>
                <md-option value="6" >MONÓXIDO DE CARBONO</md-option>
                <md-option value="8" >DIÓXIDO DE NITRÓGENO</md-option>
                <md-option value="10" >PARTÍCULAS EN SUSPENSIÓN (<10)</md-option>
                <md-option value="14" >OZONO</md-option>*/
