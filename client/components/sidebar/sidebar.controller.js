'use strict';

angular.module('datafestApp')
    .controller('LeftCtrl', function($rootScope, $scope, $timeout, $mdSidenav, $log, MainMap, bicimad, geometry, route) {

        $scope.close = function() {
            $mdSidenav('left').close()
                .then(function() {
                    $log.debug("close LEFT is done");
                });
        };

        $scope.circularRoute = {            
            length: 4
        };

        $scope.selectedIndex = 0;


        $scope.bicimadStatus = false;
        $scope.biciParkStatus = false;
        $scope.quietStreetsStatus = false;

        $rootScope.$on('$includeContentLoaded', function() {

            MainMap.setSearchInputs(document.getElementById('origin-input'), document.getElementById('destination-input'));

        });

        $scope.getCircular = route.getCircular;

        $scope.bicimad = bicimad;

    });
