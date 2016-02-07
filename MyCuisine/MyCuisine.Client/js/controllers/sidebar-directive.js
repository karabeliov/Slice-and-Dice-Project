(function () {
    'use strict';

    function sidebar() {
        return {
            restrict: 'A',
            templateUrl: 'views/directives/sidebar-directive.html'
        }
    }

    angular.module('myApp.directives')
        .directive('sidebar', [sidebar]);
}());