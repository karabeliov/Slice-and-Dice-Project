﻿// NOT LOAD IN INDEX PAGE

(function () {
    'use strict';

    function PostController($http) {
        var vm = this;

    }

    angular.module('myApp.controllers')
        .controller('PostController', ['$http', PostController])
}());



// Declare the types.
var Post = Parse.Object.extend("Post");
var Comment = Parse.Object.extend("Comment");

// Create the post
var myPost = new Post();
myPost.set('title', 'My Third Post');
myPost.set('img', '../img/foods/meat.jpg');
myPost.set('desc', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis.');
myPost.set('author', 'Kristian');

// Create the comment
var myComment = new Comment();
myComment.set("content", "Let's do Sushirrito.");

// Add the post as a value in the comment
myComment.set("parent", myPost);

// This will save both myPost and myComment
myComment.save();