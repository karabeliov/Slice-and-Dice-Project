(function () {
    'use strict';

    function BlogController($resource, $routeParams, $rootScope) {
        var vm = this;
        vm.orderProp = '-createdAt';
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
            //console.log(vm.posts);
            vm.currentPost = $.grep(data.results, function (e) { return e.objectId == currentId; })[0];
            //console.log(vm.currentPost);
        })
        .catch(function (error) {
            console.log(error)
        });


        //COMMENTS
        //var parseQueryComment = $resource('https://api.parse.com/1/classes/Comment', {}, {
        //    getCom: {
        //        method: 'GET',
        //        headers: {
        //            'X-Parse-Application-Id': 'BtESBJZiztQr2rsfiyrhJT0BhA26EL8CmnNWamvS',
        //            'X-Parse-REST-API-Key': '8DbU4OmT5kuqPP6S8UlOdVur2m5KcgXcJ8sMK2Zz',
        //        },
        //        params: {
        //            limit: limit,
        //            order: vm.orderProp
        //        }
        //    }
        //});
        //parseQueryComment.getCom().$promise
        //.then(function (data) {
        //    var currentId = $routeParams.objectId;
        //    vm.comments = data.results;
        //    //console.log(vm.comments);
        //})
        //.catch(function (error) {
        //    console.log(error)
        //});
    }

    angular.module('myApp.controllers')
        .controller('BlogController', ['$resource', '$routeParams', '$rootScope', BlogController])
}());