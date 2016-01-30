(function () {
    'use strict';

    function BlogController($resource, $routeParams, $rootScope) {
        var vm = this;
        vm.orderPost = '-createdAt';
        vm.orderComment = '-updatedAt';
        vm.loading = true;
        $rootScope.query = '';
        vm.postLimit = 3;
        vm.sidebarPostLimit = 5;
        vm.sidebarCommentLimit = 5;
        var limitForRequest = 10;

        var parseQueryPost = $resource('https://api.parse.com/1/classes/Post', {}, {
            getPost: {
                method: 'GET',
                headers: {
                    'X-Parse-Application-Id': 'BtESBJZiztQr2rsfiyrhJT0BhA26EL8CmnNWamvS',
                    'X-Parse-REST-API-Key': '8DbU4OmT5kuqPP6S8UlOdVur2m5KcgXcJ8sMK2Zz'
                },
                params: {
                    where: $rootScope.query,
                    limit: limitForRequest,
                    order: vm.orderPost
                }
            }
        });
        parseQueryPost.getPost().$promise
        .then(function (data) {
            var currentId = $routeParams.objectId;
            vm.posts = data.results;
            vm.currentPost = $.grep(data.results, function (e) { return e.objectId == currentId; })[0];
            vm.currentPost.countComment = vm.currentPost.Comments.length;
            $rootScope.currentPost = vm.currentPost;
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