(function () {
    'use strict';

    function CommentController($resource, $location, $window, notifier) {
        var vm = this;

        // ADD Comment to Current POST
        vm.sendComment = function (comment, postId) {
            var currentUser = Parse.User.current();

            if (currentUser) {
                console.log(currentUser);
                var Post = Parse.Object.extend("Post");
                var takePostQuery = new Parse.Query(Post);
                takePostQuery.equalTo("objectId", postId);
                takePostQuery.first({
                    success: function (post) {
                        comment.date = post.updatedAt;
                        comment.sender = currentUser.get('fname') || currentUser.get('username');
                        post.add('Comments', comment);
                        post.save();
                        notifier.success('Comment is add!');
                        $window.location.assign('/post/' + postId);
                    },
                    error: function (error) {
                        notifier.error("Error: " + error.code + " " + error.message);
                    }
                });
            } else {
                notifier.error("You not login!");
                $location.path('/login');
            }
        }
    }

    angular.module('myApp.controllers')
        .controller('CommentController', ['$resource', '$location', '$window', 'notifier', CommentController]);
}());