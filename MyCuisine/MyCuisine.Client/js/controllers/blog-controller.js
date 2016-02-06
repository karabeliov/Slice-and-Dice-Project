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
            },
            getCom: {
                method: 'GET',
                headers: {
                    'X-Parse-Application-Id': 'BtESBJZiztQr2rsfiyrhJT0BhA26EL8CmnNWamvS',
                    'X-Parse-REST-API-Key': '8DbU4OmT5kuqPP6S8UlOdVur2m5KcgXcJ8sMK2Zz'
                },
                params: {
                    order: '-Comments',
                    limit: vm.sidebarCommentLimit
                }
            }
        });

        parseQueryPost.getPost().$promise
        .then(function (data) {
            var currentId = $routeParams.objectId;
            vm.posts = data.results;

            vm.range = function () {
                var range = [];
                for (var i = 0; i < vm.posts.length; i = i + vm.postLimit) {
                    range.push(i);
                }
                return range;
            }

            vm.currentPage = function (index) {
                vm.page = index;
            }

            vm.currentPost = $.grep(data.results, function (e) { return e.objectId == currentId; })[0];

            vm.getCurrentPost = function (index) {
                $rootScope.currentPost = vm.posts[index];
                $rootScope.currentPost.countComment = $rootScope.currentPost.Comments.length;
            }
        })
        .catch(function (error) {
            console.log(error)
        })
        .finally(function () {
            vm.loading = false;
        });

        


        parseQueryPost.getCom().$promise
        .then(function (data) {
           vm.comments = data.results;
           console.log(vm.comments);
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