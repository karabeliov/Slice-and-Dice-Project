(function () {
    'use strict';

    function AddPostController($window, $timeout, notifier) {
        var vm = this;

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

                    $timeout(function () {
                        $window.location.assign('/blog');
                    }, 2000);
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

        //// Declare the types.
        //var Post = Parse.Object.extend("Post");
        //var Comment = Parse.Object.extend("Comment");

        //// Create the post
        //var myPost = new Post();
        //myPost.set('title', 'My Third Post');
        //myPost.set('img', '../img/foods/meat.jpg');
        //myPost.set('desc', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis.');
        //myPost.set('author', 'Kristian');

        //// Create the comment
        //var myComment = new Comment();
        //myComment.set("email", "Kris@email.bg");
        //myComment.set("content", "Let's do Sushirrito.");
        //myComment.set("avatar", "../img/my-photo.jpg");
        //// Add the post as a value in the comment
        //myComment.set("parent", myPost);

        //// This will save both myPost and myComment
        //myComment.save();
    }

    angular.module('myApp.controllers')
        .controller('AddPostController', ['$window', '$timeout', 'notifier', AddPostController])
}());