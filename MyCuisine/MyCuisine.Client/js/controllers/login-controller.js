(function () {
    'use strict';

    function LoginController($window, $timeout, notifier) {
        var vm = this;

        vm.data = {};

        vm.loginEmail = function () {
            Parse.User.logIn(vm.data.username, vm.data.password, {
                success: function (user) {
                    notifier.success('Successful login!');
                    
                    $timeout(function(){ 
                        $window.location.assign('/post/add');
                    }, 2000);
                },
                error: function (user, error) {
                    notifier.error('Username/Password combination is not valid!');
                }
            });
        };

        vm.signupEmail = function () {
            var user = new Parse.User();
            user.set("username", vm.data.username);
            user.set("password", vm.data.password);
            user.set("email", vm.data.email);

            user.signUp(null, {
                success: function (user) {
                    notifier.success('Registration successful!');

                    $timeout(function () {
                        $window.location.assign('/login');
                    }, 2000);
                },
                error: function (user, error) {
                    notifier.error("Error: " + error.code + " " + error.message);
                }
            });
        };
    }

    angular.module('myApp.controllers')
        .controller('LoginController', ['$window', '$timeout', 'notifier', LoginController])
}());