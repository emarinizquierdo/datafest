'use strict';

angular.module('datafestApp')
    .controller('LeftCtrl', function($rootScope, $scope, $timeout, $mdSidenav, $log) {

        $scope.close = function() {
            $mdSidenav('left').close()
                .then(function() {
                    $log.debug("close LEFT is done");
                });
        };

        var tabs = [{
            title: 'A to B'
        }, {
            title: 'Circular'
        }];

        $scope.tabs = tabs;
        $scope.selectedIndex = 0;


    });
