(function () {
    'use strict';

    function CommentController($routeParams) {
        var vm = this;

        var currentId = $routeParams.id;
    }

    angular.module('myApp.controllers')
        .controller('CommentController', ['$routeParams', CommentController])
}());