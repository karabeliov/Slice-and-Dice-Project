(function () {
    'use strict';

    function CommentController($routeParams,$resource, $rootScope) {
        //var vm = this;
        //var currentId = $routeParams.id;

        var vm = this;
        vm.orderProp = '-createdAt';
        //$rootScope.query = '$routeParams.id';
        var limit = 5;

        var parseQueryPost = $resource('https://api.parse.com/1/classes/Comment', {}, {
            getComment: {
                method: 'GET',
                headers: {
                    'X-Parse-Application-Id': 'BtESBJZiztQr2rsfiyrhJT0BhA26EL8CmnNWamvS',
                    'X-Parse-REST-API-Key': '8DbU4OmT5kuqPP6S8UlOdVur2m5KcgXcJ8sMK2Zz',
                },
                params:  { 
                    //where: $rootScope.query,
                    limit: limit,
                    order: vm.orderProp
                }
            }
        });
        parseQueryPost.getComment().$promise
        .then(function (data) {
            vm.comments = data.results;
            console.log(vm.comments);
        })
        .catch(function (error) {
            console.log(error)
        });
    }

    angular.module('myApp.controllers')
        .controller('CommentController', ['$resource', '$routeParams', '$rootScope', CommentController])
}());