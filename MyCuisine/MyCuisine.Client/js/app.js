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
            .when('/post', {
                title: 'Post',
                templateUrl: PARTIALS_PREFIX + 'post.html',
                controllerAs: CONTROLLER_AS_VIEW_MODEL
            })
            .otherwise({ redirectTo: '/' });
    }

    angular.module('myApp.services', []);
    angular.module('myApp.directives', []);
    angular.module('myApp.controllers', ['myApp.services']);
    var myApp = angular.module('myApp', ['ngRoute', 'myApp.controllers', 'myApp.directives']).
        config(['$routeProvider', '$locationProvider', config])
        .constant('baseServiceUrl', 'http://localhost:64352/');

    myApp.run(['$location', '$rootScope', function ($location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
        });
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.style = current.$$route.style || 'page';
        });
    }]);
}());