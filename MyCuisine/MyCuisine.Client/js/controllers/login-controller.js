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