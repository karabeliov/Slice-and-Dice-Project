(function () {
    'use strict';

    function AddPostController($location, $route, notifier) {
        var vm = this,
        currentUser = Parse.User.current(),
        succsessMsg = 'Post is public now!',
        errorMsg = 'Error: Need high level access!';

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
                    notifier.success(succsessMsg);
                    $location.path('/blog');
                    $route.reload();
                },
                error: function (error) {
                    notifier.error(errorMsg);
                }
            });
        };

        vm.reset = function () {
            vm.post = '';
        };
    }

    angular.module('myApp.controllers')
        .controller('AddPostController', ['$location', '$route', 'notifier', AddPostController]);
}());