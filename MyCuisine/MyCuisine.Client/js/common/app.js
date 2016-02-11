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