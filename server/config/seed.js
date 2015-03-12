/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Station = require('../api/station/station.model');

Station.find({}).remove(function() {
    Station.create({
        "FID": 0,
        "StationCod": 28079004,
        "Name": "Pza. de España",
        "Latitud": "40 25 26 N",
        "Longitud": "3 42 44 W",
        "Latitud_D": 40.423888888900002,
        "Longitud_D": -3.7122222222199999,
        "MostPollut": 89,
        "LessPollut": 21,
        "Intermedia": 64
    }, {
        "FID": 1,
        "StationCod": 28079008,
        "Name": "Escuelas Aguirre",
        "Latitud": "40 25 18 N",
        "Longitud": "3 40 56 W",
        "Latitud_D": 40.421666666699998,
        "Longitud_D": -3.6822222222200001,
        "MostPollut": 125,
        "LessPollut": 35,
        "Intermedia": 91
    }, {
        "FID": 2,
        "StationCod": 28079011,
        "Name": "Av. Ramón y Cajal",
        "Latitud": "40 27 05 N",
        "Longitud": "3 40 38 W",
        "Latitud_D": 40.451388888899999,
        "Longitud_D": -3.6772222222200002,
        "MostPollut": 119,
        "LessPollut": 26,
        "Intermedia": 72
    }, {
        "FID": 3,
        "StationCod": 28079016,
        "Name": "Arturo Soria",
        "Latitud": "40 26 24 N",
        "Longitud": "3 38 21 W",
        "Latitud_D": 40.439999999999998,
        "Longitud_D": -3.63916666667,
        "MostPollut": 106,
        "LessPollut": 20,
        "Intermedia": 78
    }, {
        "FID": 4,
        "StationCod": 28079017,
        "Name": "Villaverde Alto",
        "Latitud": "40 20 50 N",
        "Longitud": "3 42 48 W",
        "Latitud_D": 40.347222222200003,
        "Longitud_D": -3.71333333333,
        "MostPollut": 131,
        "LessPollut": 17,
        "Intermedia": 108
    }, {
        "FID": 5,
        "StationCod": 28079018,
        "Name": "C/ Farolillo",
        "Latitud": "40 23 41 N",
        "Longitud": "3 43 55 W",
        "Latitud_D": 40.394722222200002,
        "Longitud_D": -3.7319444444399998,
        "MostPollut": 91,
        "LessPollut": 11,
        "Intermedia": 74
    }, {
        "FID": 6,
        "StationCod": 28079024,
        "Name": "Casa de Campo",
        "Latitud": "40 25 10 N",
        "Longitud": "3 44 50 W",
        "Latitud_D": 40.4194444444,
        "Longitud_D": -3.74722222222,
        "MostPollut": 74,
        "LessPollut": 3,
        "Intermedia": 66
    }, {
        "FID": 7,
        "StationCod": 28079027,
        "Name": "Barajas",
        "Latitud": "40 28 37 N",
        "Longitud": "3 34 48 W",
        "Latitud_D": 40.476944444399997,
        "Longitud_D": -3.5800000000000001,
        "MostPollut": 74,
        "LessPollut": 9,
        "Intermedia": 59
    }, {
        "FID": 8,
        "StationCod": 28079035,
        "Name": "Pza. del Carmen",
        "Latitud": "40 25 09 N",
        "Longitud": "3 42 11 W",
        "Latitud_D": 40.419166666700001,
        "Longitud_D": -3.7030555555600002,
        "MostPollut": 103,
        "LessPollut": 28,
        "Intermedia": 82
    }, {
        "FID": 9,
        "StationCod": 28079036,
        "Name": "Moratalaz",
        "Latitud": "40 24 29 N",
        "Longitud": "3 38 43 W",
        "Latitud_D": 40.408055555600001,
        "Longitud_D": -3.6452777777800001,
        "MostPollut": 113,
        "LessPollut": 16,
        "Intermedia": 91
    }, {
        "FID": 10,
        "StationCod": 28079038,
        "Name": "Cuatro Caminos",
        "Latitud": "40 26 44 N",
        "Longitud": "3 42 26 W",
        "Latitud_D": 40.445555555600002,
        "Longitud_D": -3.70722222222,
        "MostPollut": 112,
        "LessPollut": 18,
        "Intermedia": 78
    }, {
        "FID": 11,
        "StationCod": 28079039,
        "Name": "Barrio del Pilar",
        "Latitud": "40 28 42 N",
        "Longitud": "3 42 42 W",
        "Latitud_D": 40.4783333333,
        "Longitud_D": -3.7116666666699998,
        "MostPollut": 165,
        "LessPollut": 18,
        "Intermedia": 101
    }, {
        "FID": 12,
        "StationCod": 28079040,
        "Name": "Vallecas",
        "Latitud": "40 23 17 N",
        "Longitud": "3 39 05 W",
        "Latitud_D": 40.388055555599998,
        "Longitud_D": -3.6513888888900001,
        "MostPollut": 105,
        "LessPollut": 16,
        "Intermedia": 78
    }, {
        "FID": 13,
        "StationCod": 28079047,
        "Name": "Méndez Álvaro Alta",
        "Latitud": "40 23 53 N",
        "Longitud": "3 41 12 W",
        "Latitud_D": 40.398055555600003,
        "Longitud_D": -3.6866666666699999,
        "MostPollut": 100,
        "LessPollut": 13,
        "Intermedia": 80
    }, {
        "FID": 14,
        "StationCod": 28079048,
        "Name": "Pº. Castellana Alta",
        "Latitud": "40 26 23 N",
        "Longitud": "3 41 25 W",
        "Latitud_D": 40.439722222199997,
        "Longitud_D": -3.69027777778,
        "MostPollut": 96,
        "LessPollut": 21,
        "Intermedia": 70
    }, {
        "FID": 15,
        "StationCod": 28079049,
        "Name": "Retiro Alta",
        "Latitud": "40 24 52 N",
        "Longitud": "3 40 57 W",
        "Latitud_D": 40.414444444399997,
        "Longitud_D": -3.6825000000000001,
        "MostPollut": 89,
        "LessPollut": 16,
        "Intermedia": 68
    }, {
        "FID": 16,
        "StationCod": 28079050,
        "Name": "Pza. Castilla Alta",
        "Latitud": "40 27 56 N",
        "Longitud": "3 41 19 W",
        "Latitud_D": 40.465555555599998,
        "Longitud_D": -3.6886111111100002,
        "MostPollut": 116,
        "LessPollut": 38,
        "Intermedia": 79
    }, {
        "FID": 17,
        "StationCod": 28079054,
        "Name": "Ensanche Vallecas",
        "Latitud": "40 22 22 N",
        "Longitud": "3 36 43W",
        "Latitud_D": 40.372777777800003,
        "Longitud_D": -3.6119444444400002,
        "MostPollut": 117,
        "LessPollut": 15,
        "Intermedia": 81
    }, {
        "FID": 18,
        "StationCod": 28079055,
        "Name": "Urb. Embajada (Barajas)",
        "Latitud": "40 27 45 N",
        "Longitud": "3 34 50 W",
        "Latitud_D": 40.462499999999999,
        "Longitud_D": -3.5805555555600002,
        "MostPollut": 96,
        "LessPollut": 13,
        "Intermedia": 77
    }, {
        "FID": 19,
        "StationCod": 28079056,
        "Name": "Pza. Fdez. Ladreda",
        "Latitud": "40 23 05 N",
        "Longitud": "3 43 7 W",
        "Latitud_D": 40.384722222199997,
        "Longitud_D": -3.71861111111,
        "MostPollut": 126,
        "LessPollut": 22,
        "Intermedia": 99
    }, {
        "FID": 20,
        "StationCod": 28079057,
        "Name": "Sanchinarro Alta",
        "Latitud": "40 29 39 N",
        "Longitud": "3 39 38 W",
        "Latitud_D": 40.494166666700004,
        "Longitud_D": -3.6605555555599998,
        "MostPollut": 116,
        "LessPollut": 13,
        "Intermedia": 67
    }, {
        "FID": 21,
        "StationCod": 28079058,
        "Name": "El Pardo Alta",
        "Latitud": "40 31 05 N",
        "Longitud": "3 46 29 W",
        "Latitud_D": 40.5180555556,
        "Longitud_D": -3.7747222222199999,
        "MostPollut": 36,
        "LessPollut": 3,
        "Intermedia": 36
    }, {
        "FID": 22,
        "StationCod": 28079059,
        "Name": "Parque Juan Carlos I",
        "Latitud": "40 27 54 N",
        "Longitud": "3 36 32 W",
        "Latitud_D": 40.465000000000003,
        "Longitud_D": -3.6088888888900001,
        "MostPollut": 61,
        "LessPollut": 13,
        "Intermedia": 50
    }, {
        "FID": 23,
        "StationCod": 28079060,
        "Name": "Tres Olivos Alta",
        "Latitud": "40 30 02 N",
        "Longitud": "3 41 23 W",
        "Latitud_D": 40.500555555600002,
        "Longitud_D": -3.6897222222199999,
        "MostPollut": 102,
        "LessPollut": 19,
        "Intermedia": 70
    });
});
