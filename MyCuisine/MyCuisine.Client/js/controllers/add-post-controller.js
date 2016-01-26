(function () {
    'use strict';

    function AddPostController($window, notifier) {
        var vm = this;

        //var post = ...;

        //var user = Parse.User.current();
        //var relation = user.relation("posts");
        //relation.add(post);
        //user.save();

        vm.master = {};

        vm.update = function (post) {
            var Post = Parse.Object.extend('Post');
            var myPost = new Post();
            myPost.set('title', post.title);
            myPost.set('author', post.author);
            myPost.set('img', post.image);
            myPost.set('desc', post.description);
            myPost.save(null, {
                success: function (post) {
                    notifier.success('Post is public now!');
                    $window.location.assign('/blog');
                },
                error: function (post, error) {
                    notifier.error("Error: " + error.code + " " + error.message);
                }
            });
        };

        vm.reset = function () {
            vm.post = '';
        };

        vm.reset();
    }

    angular.module('myApp.controllers')
        .controller('AddPostController', ['$window', 'notifier', AddPostController])
}());