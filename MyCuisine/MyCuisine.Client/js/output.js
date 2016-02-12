(function () {
    'use strict';

    function config($routeProvider, $locationProvider) {

        var PARTIALS_PREFIX = 'views/';
        var CONTROLLER_AS_VIEW_MODEL = 'vm';
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                title: 'Home',
                style: 'home',
                templateUrl: PARTIALS_PREFIX + 'home.html',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/location', {
                title: 'Location',
                templateUrl: PARTIALS_PREFIX + 'location.html',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/all-menu', {
                title: 'All Menu',
                templateUrl: PARTIALS_PREFIX + 'menu/all-menu.html',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/breakfast-menu', {
                title: 'Breakfast Menu',
                templateUrl: PARTIALS_PREFIX + 'menu/breakfast-menu.html',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/lunch-menu', {
                title: 'Lunch Menu',
                templateUrl: PARTIALS_PREFIX + 'menu/lunch-menu.html',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/dinner-menu', {
                title: 'Dinner Menu',
                templateUrl: PARTIALS_PREFIX + 'menu/dinner-menu.html',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/blog', {
                title: 'Blog',
                templateUrl: PARTIALS_PREFIX + 'blog.html',
                controller: 'BlogController',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/login', {
                title: 'Login',
                templateUrl: PARTIALS_PREFIX + 'login.html',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/post/add', {
                title: 'Add Post',
                templateUrl: PARTIALS_PREFIX + 'addPost.html',
                controller: 'AddPostController',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/post/:objectId', {
                title: 'Post',
                templateUrl: PARTIALS_PREFIX + 'post.html',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .otherwise({ redirectTo: '/' });
    }

    angular.module('myApp.services', []);
    angular.module('myApp.directives', []);
    angular.module('myApp.controllers', ['myApp.services']);
    var myApp = angular.module('myApp', ['ngRoute', 'ngResource', 'myApp.controllers', 'myApp.directives'])
        .config(['$routeProvider', '$locationProvider', config])
        .value('toastr', toastr);

    myApp.run(['$rootScope', function ($rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
            $rootScope.style = current.$$route.style || 'page';
        });
    }]);
}());
// Active class
$(function () {
    $('.nav li').click(function () {
        $('#navbar li').removeClass('active');
        $(this).addClass('active');
    });
});

Parse.initialize("BtESBJZiztQr2rsfiyrhJT0BhA26EL8CmnNWamvS", "mwzjvu8gOMfnZgw6hUaWT0daQ83c6kEDsMp0kttV");

(function () {
    'use strict';

    angular.module('myApp.services').factory('notifier', ['toastr', function (toastr) {
        return {
            success: function (msg) {
                toastr.success(msg);
            },
            error: function (msg) {
                toastr.error(msg);
            }
        }
    }]);
}());
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
(function () {
    'use strict';

    function BlogController($resource, $routeParams, $rootScope, notifier) {
        var vm = this;
        vm.orderPost = '-createdAt';
        vm.orderComment = '-Comments';
        vm.loading = true;
        vm.postLimit = 3;
        vm.sidebarPostLimit = 5;
        vm.sidebarCommentLimit = 5;

        const limitForRequest = 10,
        requestUrl = 'https://api.parse.com/1/classes/Post',
        appId = 'BtESBJZiztQr2rsfiyrhJT0BhA26EL8CmnNWamvS',
        apiKey = '8DbU4OmT5kuqPP6S8UlOdVur2m5KcgXcJ8sMK2Zz';

        var parseQueryPost = $resource(requestUrl, {}, {
            getPost: {
                method: 'GET',
                headers: {
                    'X-Parse-Application-Id': appId,
                    'X-Parse-REST-API-Key': apiKey
                },
                params: {
                    limit: limitForRequest,
                    order: vm.orderPost
                }
            },
            getCom: {
                method: 'GET',
                headers: {
                    'X-Parse-Application-Id': appId,
                    'X-Parse-REST-API-Key': apiKey
                },
                params: {
                    order: vm.orderComment,
                    limit: vm.sidebarCommentLimit
                }
            }
        });

        parseQueryPost.getPost().$promise
        .then(function (data) {
            var currentId = $routeParams.objectId;
            vm.posts = data.results;

            vm.range = function () {
                var range = [];
                for (var i = 0; i < vm.posts.length; i = i + vm.postLimit) {
                    range.push(i);
                }
                return range;
            }

            vm.currentPage = function (index) {
                vm.page = index;
            }

            vm.currentPost = $.grep(data.results, function (e) {
                return e.objectId == currentId;
            })[0];
            
        })
        .catch(function (error) {
            //notifier.error(error);
        })
        .finally(function () {
            vm.loading = false;
        });
       
        parseQueryPost.getCom().$promise
        .then(function (data) {
           vm.comments = data.results;
        })
        .catch(function (error) {
            //notifier.error(error);
        })
        .finally(function () {
           vm.loading = false;
        });
    }

    angular.module('myApp.controllers')
        .controller('BlogController', ['$resource', '$routeParams', '$rootScope', 'notifier', BlogController])
}());
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
(function () {
    'use strict';

    function LoginController($window, $location, $route, notifier) {
        var vm = this,
        succsessLoginMsg = 'Successful login!',
        succsessRegistrationMsg = 'Registration successful!',
        succsessLogOutMsg = 'Successful logout!',
        succsessForgotMsg = 'Password reset request was sent successfully!',
        errorLoginMsg = 'Username/Password combination is not valid!';

        vm.currentUser = Parse.User.current();

        vm.login = function (user) {
            Parse.User.logIn(user.username, user.password, {
                success: function (user) {
                    vm.currentUser = user;
                    notifier.success(succsessLoginMsg);
                    $window.location.assign('/blog');
                },
                error: function (user, error) {
                    notifier.error(errorLoginMsg);
                }
            });
        };

        vm.signup = function (user) {
            var newUser = new Parse.User();
            newUser.set("username", user.username);
            newUser.set("password", user.password);
            newUser.set("email", user.email);
            newUser.set("fname", user.fname);
            newUser.set("lname", user.lname);

            newUser.signUp(null, {
                success: function (user) {
                    notifier.success(succsessRegistrationMsg);
                    vm.currentUser = user;
                    $window.location.assign('/blog');
                },
                error: function (user, error) {
                    notifier.error("Error: " + error.code + " " + error.message);
                }
            });
        };

        vm.logOut = function (form) {
            Parse.User.logOut();
            notifier.success(succsessLogOutMsg);
            vm.currentUser = null;
            $location.path('/');
            $route.reload();
        };

        vm.forgot = function (userEmail) {
            Parse.User.requestPasswordReset(userEmail, {
                success: function () {
                    notifier.success(succsessForgotMsg);
                },
                error: function (error) {
                    notifier.error("Error: " + error.code + " " + error.message);
                }
            });
        }
    }

    angular.module('myApp.controllers')
        .controller('LoginController', ['$window', '$location', '$route', 'notifier', LoginController]);
}());
(function () {
    'use strict';

    function post() {
        return {
            restrict: 'A',
            templateUrl: 'views/directives/post-directive.html'
        }
    }

    angular.module('myApp.directives')
        .directive('post', [post]);
}());
(function () {
    'use strict';

    function sidebar() {
        return {
            restrict: 'A',
            templateUrl: 'views/directives/sidebar-directive.html'
        }
    }

    angular.module('myApp.directives')
        .directive('sidebar', [sidebar]);
}());