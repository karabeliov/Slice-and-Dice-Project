(function () {
    'use strict';

    function CommentController($resource, notifier) {
        var vm = this;
 
        // ADD Comment to Current POST
        vm.sendComment = function (comment, postId) {
            console.log(comment, postId);

            var Post = Parse.Object.extend("Post");
            var takePostQuery = new Parse.Query(Post);
            takePostQuery.equalTo("objectId", postId);
            takePostQuery.first({
                success: function (post) {
                    comment.date = post.updatedAt;
                    post.add('Comments', comment);
                    post.save();
                    notifier.success('Comment is add!');
                },
                error: function (error) {
                    notifier.error("Error: " + error.code + " " + error.message);
                }
            });
        }
    }

    angular.module('myApp.controllers')
        .controller('CommentController', ['$resource', 'notifier', CommentController]);
}());