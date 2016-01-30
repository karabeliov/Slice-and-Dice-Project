(function () {
    'use strict';

    function AddPostController($window, notifier) {
        var vm = this;
        var currentUser = Parse.User.current();

        vm.public = function (post) {
            var Post = Parse.Object.extend('Post');
            var myPost = new Post();
            myPost.set('title', post.title);
            myPost.set('author', currentUser.get('fname') || currentUser.get('username'));
            myPost.set('img', post.image);
            myPost.set('category', post.category);
            myPost.set('desc', post.description);
            myPost.save(null, {
                success: function () {
                    notifier.success('Post is public now!');
                    $window.location.assign('/blog');
                },
                error: function (error) {
                    notifier.error("Error: Need high level access!");
                }
            });
        };

        vm.reset = function () {
            vm.post = '';
        };

        vm.reset();
    }

    angular.module('myApp.controllers')
        .controller('AddPostController', ['$window', 'notifier', AddPostController]);
}());