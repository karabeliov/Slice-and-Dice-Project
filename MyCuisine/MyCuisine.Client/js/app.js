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
                controller: 'HomeController',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/location', {
                title: 'Location',
                templateUrl: PARTIALS_PREFIX + 'location.html',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .when('/menu', {
                title: 'Menu',
                templateUrl: PARTIALS_PREFIX + 'menu.html',
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
        .value('toastr', toastr)
        .constant('baseServiceUrl', 'http://localhost:64352/');

    myApp.run(['$location', '$window', '$rootScope', '$timeout', 'notifier', function ($location, $window, $rootScope, $timeout, notifier) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
            $rootScope.style = current.$$route.style || 'page';
        });

        $rootScope.currentUser = Parse.User.current();

        $rootScope.login = function (user) {
            Parse.User.logIn(user.username, user.password, {
                success: function (user) {
                    $rootScope.currentUser = user;
                    notifier.success('Successful login!');
                },
                error: function (user, error) {
                    notifier.error('Username/Password combination is not valid!');
                }
            });

            $timeout({}, 0);
            $location.path('/post/add');
        };

        $rootScope.signup = function (user) {
            var newUser = new Parse.User();
            newUser.set("username", user.username);
            newUser.set("password", user.password);
            newUser.set("email", user.email);
            newUser.set("fname", user.fname);
            newUser.set("lname", user.lname);

            newUser.signUp(null, {
                success: function (user) {
                    notifier.success('Registration successful!');
                    $rootScope.currentUser = user;
                    $window.location.assign('/blog');
                },
                error: function (user, error) {
                    notifier.error("Error: " + error.code + " " + error.message);
                }
            });
        };

        $rootScope.logOut = function (form) {
            Parse.User.logOut();
            notifier.success('Successful logout!');
            $rootScope.currentUser = null;
            $timeout({}, 0);
            $location.path('/');
        };

        $rootScope.forgot = function (userEmail) {
            Parse.User.requestPasswordReset(userEmail, {
                success: function () {
                    notifier.success('Password reset request was sent successfully!');
                },
                error: function (error) {
                    notifier.error("Error: " + error.code + " " + error.message);
                }
            });
        }
    }]);
}());