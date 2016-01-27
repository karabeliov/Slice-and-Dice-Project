(function () {
    'use strict';

    function BlogController($resource, $routeParams, $rootScope) {
        var vm = this;
        vm.orderProp = '-createdAt';
        vm.loading = true;
        $rootScope.query = '';
        var limit = 3;

        var parseQueryPost = $resource('https://api.parse.com/1/classes/Post', {}, {
            getPost: {
                method: 'GET',
                headers: {
                    'X-Parse-Application-Id': 'BtESBJZiztQr2rsfiyrhJT0BhA26EL8CmnNWamvS',
                    'X-Parse-REST-API-Key': '8DbU4OmT5kuqPP6S8UlOdVur2m5KcgXcJ8sMK2Zz'
                },
                params:  { 
                    where: $rootScope.query,
                    limit: limit,
                    order: vm.orderProp
                }
            }
        });
        parseQueryPost.getPost().$promise
        .then(function (data) {
            var currentId = $routeParams.objectId;
            vm.posts = data.results;
            vm.currentPost = $.grep(data.results, function (e) { return e.objectId == currentId; })[0];
        })
        .catch(function (error) {
            console.log(error)
        })
        .finally(function () {
            vm.loading = false;
        });
    }

    angular.module('myApp.controllers')
        .controller('BlogController', ['$resource', '$routeParams', '$rootScope', BlogController])
}());