(function () {
    'use strict';

    function CommentController($resource, notifier) {
        var vm = this;
        vm.orderProp = '-createdAt';
        var limit = 5;

        var parseQueryComment = $resource('https://api.parse.com/1/classes/Comment', {}, {
            getCom: {
                method: 'GET',
                headers: {
                    'X-Parse-Application-Id': 'BtESBJZiztQr2rsfiyrhJT0BhA26EL8CmnNWamvS',
                    'X-Parse-REST-API-Key': '8DbU4OmT5kuqPP6S8UlOdVur2m5KcgXcJ8sMK2Zz',
                },
                params: {
                    limit: limit,
                    order: vm.orderProp
                }
            }
        });

        parseQueryComment.getCom().$promise
            .then(function (data) {
                vm.comments = data.results;
                //console.log(vm.comments[0].parent.objectId);

                //vm.getPost = function getPost(objectId) {
                //    var Comment = Parse.Object.extend("Post");
                //    var query = new Parse.Query(Comment);
                //    query.get(objectId, {
                //        success: function (post) {
                //            console.log(post.get('title'));
                //            //vm.title = post.get('title');
                //            return post.get('title');
                //            // The object was retrieved successfully.
                //        },
                //        error: function (object, error) {
                //            console.log(error)
                //            // The object was not retrieved successfully.
                //            // error is a Parse.Error with an error code and message.
                //        }
                //    });
                //}
            })
            .catch(function (error) {
                console.log(error)
            });

        // ADD Comment to Current POST
        vm.sendComment = function (comment, postId) {
            console.log(comment, postId);

            var Post = Parse.Object.extend("Post");
            var takePost = new Parse.Query(Post);
            takePost.equalTo("objectId", postId);
            takePost.first({
                success: function (post) {
                    comment.date = post.updatedAt;
                    post.add('Comments', comment)
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
        .controller('CommentController', ['$resource', 'notifier', CommentController])
}());