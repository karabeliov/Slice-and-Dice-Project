(function () {
    'use strict';

    function CommentController($resource, $location, $route, notifier) {
        var vm = this,
        succsessCommentMsg = 'Comment is add!',
        succsessReplyMsg = 'Reply is add!',
        errorMsg = 'You not login!';

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
                        comment.reply = [];
                        comment.sender = currentUser.get('fname') ? currentUser.get('fname') : currentUser.get('username');
                        comment.img = currentUser.get('img') ? currentUser.get('img') : '../css/img/comments/avatar.jpg';

                        post.add('Comments', comment);
                        post.save();
                        notifier.success(succsessCommentMsg);
                        $route.reload();
                    },
                    error: function (error) {
                        notifier.error("Error: " + error.code + " " + error.message);
                    }
                });
            } else {
                notifier.error(errorCommentMsg);
                $location.path('/login');
            }
        }

        // ADD Reply to Current COMMENT
        vm.replyComment = function (reply, postId, commentId) {
            console.log(reply, postId, commentId);
            var currentUser = Parse.User.current();
            if (currentUser) {
                reply.sender = currentUser.get('fname') || currentUser.get('username');
                reply.img = currentUser.get('img') ? currentUser.get('img') : '../css/img/comments/avatar.jpg';

                var Post = Parse.Object.extend("Post");
                var takePostQuery = new Parse.Query(Post);
                takePostQuery.equalTo("objectId", postId);
                takePostQuery.first({
                    success: function (post) {
                        var comments = post.get('Comments');
                        reply.date = post.updatedAt;
                        comments[commentId].reply.push(reply);
                        
                        post.save();
                        notifier.success(succsessReplyMsg);
                        $route.reload();
                    },
                    error: function (error) {
                        notifier.error("Error: " + error.code + " " + error.message);
                    }
                });
            } else {
                notifier.error(errorCommentMsg);
                $location.path('/login');
                $route.reload();
            }
        }
    }

    angular.module('myApp.controllers')
        .controller('CommentController', ['$resource', '$location', '$route', 'notifier', CommentController]);
}());