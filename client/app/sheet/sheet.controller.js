'use strict';

angular.module('datafestApp')
    .controller('SheetCtrl', function($scope, shData) {

    	$scope.shData = shData;

    	$scope.month = $scope.shData.day.getMonth() + 1;
    	$scope.day = $scope.shData.day.getDate();
    	$scope.hour = $scope.shData.day.getHours();

    	$scope.$watch('month', function( p_new, p_old ){

    		if(p_new && (p_new != p_old)){
    			shData.day.setMonth(p_new - 1);
    			shData.updateDay();
    		}
    		
    	});

    	$scope.$watch('day', function( p_new, p_old ){

    		if(p_new && (p_new != p_old)){
    			shData.day.setDate(p_new);
    			shData.updateDay();
    		}
    		
    	});

    	$scope.$watch('hour', function( p_new, p_old ){

    		if(p_new && (p_new != p_old)){
    			shData.day.setHours(p_new);
    			shData.updateDay();
    		}    		

    	});

    });
