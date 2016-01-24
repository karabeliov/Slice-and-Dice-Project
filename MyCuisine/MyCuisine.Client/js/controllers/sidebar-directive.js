(function () {
    'use strict';

    function sidebar() {
        return {
            restrict: 'A',
            templateUrl: 'views/directives/sidebar.html'
        }
    }

    angular.module('myApp.directives')
        .directive('sidebar', [sidebar]);
}());