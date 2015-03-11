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
            .primaryPalette('lime')
            .accentPalette('orange');

    });


angular.module('datafestApp')
    .controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function() {
                    $log.debug("toggle left is done");
                });
        };
    });
