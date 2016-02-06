(function () {
    'use strict';

    function post() {
        return {
            restrict: 'A',
            templateUrl: 'views/directives/post.html'
        }
    }

    angular.module('myApp.directives')
        .directive('post', [post]);
}());