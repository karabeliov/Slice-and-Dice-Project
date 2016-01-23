(function () {
    'use strict';

    function BlogController() {
        var vm = this;

        vm.posts = [
            {
                'title': 'Blog Post Title 1 ',
                'img': '../img/foods/mekici.jpg',
                'desc': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis.',
                'author': 'Kristian',
                'date': 'August 24, 2013',
                'time': '9:00 PM'
            },
            {
                'title': 'Blog Post Title 2',
                'img': '../img/foods/bulgarian-shopska-salad-2.jpg',
                'desc': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis.',
                'author': 'Kristian',
                'date': 'August 24, 2013',
                'time': '9:00 PM'
            },
            {
                'title': 'Blog Post Title 3',
                'img': '../img/foods/meat.jpg',
                'desc': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis.',
                'author': 'Kristian',
                'date': 'August 24, 2013',
                'time': '9:00 PM'
            }
        ];

        vm.orderProp = 'title';
    }

    angular.module('myApp.controllers')
        .controller('BlogController', [BlogController])
}());