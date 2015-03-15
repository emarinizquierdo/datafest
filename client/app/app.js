'use strict';

angular.module('datafestApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngMaterial'
    ])
    .config(function($routeProvider, $locationProvider, $mdThemingProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink');

        /* themes :
        red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green,
        light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey */
    });


angular.module('datafestApp')
    .controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log, MainMap) {
        
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function() {
                    $log.debug("toggle left is done");
                });
        };

        $scope.MainMap = MainMap;
    });
