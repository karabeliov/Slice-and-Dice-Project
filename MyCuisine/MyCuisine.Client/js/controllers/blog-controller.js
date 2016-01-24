(function () {
    'use strict';

    function BlogController($resource) {
        var vm = this;
        vm.orderProp = 'date';
        var limit = 3;

        var parseQueryPost = $resource('https://api.parse.com/1/classes/Post', {}, {
            getPost: {
                method: 'GET',
                headers: {
                    'X-Parse-Application-Id': 'BtESBJZiztQr2rsfiyrhJT0BhA26EL8CmnNWamvS',
                    'X-Parse-REST-API-Key': '8DbU4OmT5kuqPP6S8UlOdVur2m5KcgXcJ8sMK2Zz',
                },
                params:  { 
                    //where: vm.query,
                    limit: limit,
                    order: vm.orderProp
                }
            }
        });
        parseQueryPost.getPost().$promise
        .then(function (data) {
            console.log(data.results);
            vm.posts = data.results;
        })
        .catch(function (error) {
            console.log(error)
        });
    }

    angular.module('myApp.controllers')
        .controller('BlogController', ['$resource', BlogController])
}());