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

        $scope.$watch('selectedIndex', function( p_new, p_old){
            if(p_new && (p_new != p_old) && p_new == 1){
                MainMap.hide(MainMap.objects.directionsDisplay);
                MainMap.hide(MainMap.objects.line);
                MainMap.objects.selectedIndex = 1;
            }else if(p_new == 0 && (p_new != p_old)){
                MainMap.show(MainMap.objects.directionsDisplay)
                MainMap.show(MainMap.line);
                MainMap.calcRoute($rootScope.directions.origin, $rootScope.directions.destination);
                MainMap.objects.selectedIndex = 0;
            }
        })

        $scope.bicimadStatus = false;
        $scope.biciParkStatus = false;
        $scope.quietStreetsStatus = false;
        $scope.getCircular = route.getCircular;
        $scope.bicimad = bicimad;

        $rootScope.$on('$includeContentLoaded', function() {

            MainMap.setSearchInputs(document.getElementById('origin-input'), document.getElementById('destination-input'));

        });

        

    });
