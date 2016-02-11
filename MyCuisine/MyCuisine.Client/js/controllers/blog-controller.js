(function () {
    'use strict';

    function BlogController($resource, $routeParams, $rootScope, notifier) {
        var vm = this;
        vm.orderPost = '-createdAt';
        vm.orderComment = '-Comments';
        vm.loading = true;
        vm.postLimit = 3;
        vm.sidebarPostLimit = 5;
        vm.sidebarCommentLimit = 5;

        const limitForRequest = 10,
        requestUrl = 'https://api.parse.com/1/classes/Post',
        appId = 'BtESBJZiztQr2rsfiyrhJT0BhA26EL8CmnNWamvS',
        apiKey = '8DbU4OmT5kuqPP6S8UlOdVur2m5KcgXcJ8sMK2Zz';

        var parseQueryPost = $resource(requestUrl, {}, {
            getPost: {
                method: 'GET',
                headers: {
                    'X-Parse-Application-Id': appId,
                    'X-Parse-REST-API-Key': apiKey
                },
                params: {
                    limit: limitForRequest,
                    order: vm.orderPost
                }
            },
            getCom: {
                method: 'GET',
                headers: {
                    'X-Parse-Application-Id': appId,
                    'X-Parse-REST-API-Key': apiKey
                },
                params: {
                    order: vm.orderComment,
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

            vm.currentPost = $.grep(data.results, function (e) {
                return e.objectId == currentId;
            })[0];

            if (vm.currentPost) {
                vm.currentPost.countComment = vm.currentPost.Comments.length;
            }
        })
        .catch(function (error) {
            notifier.error(error);
        })
        .finally(function () {
            vm.loading = false;
        });
       
        parseQueryPost.getCom().$promise
        .then(function (data) {
           vm.comments = data.results;
        })
        .catch(function (error) {
            notifier.error(error);
        })
        .finally(function () {
           vm.loading = false;
        });
    }

    angular.module('myApp.controllers')
        .controller('BlogController', ['$resource', '$routeParams', '$rootScope', 'notifier', BlogController])
}());