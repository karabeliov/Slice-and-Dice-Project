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
            vm.currentPost.countComment = vm.currentPost.Comments.length;
            
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
(function(i,g,c,k,d,l,f){/*! Jssor */
new(function(){});var e=i.$JssorEasing$={$EaseSwing:function(a){return-c.cos(a*c.PI)/2+.5},$EaseLinear:function(a){return a},$EaseInQuad:function(a){return a*a},$EaseOutQuad:function(a){return-a*(a-2)},$EaseInOutQuad:function(a){return(a*=2)<1?1/2*a*a:-1/2*(--a*(a-2)-1)},$EaseInCubic:function(a){return a*a*a},$EaseOutCubic:function(a){return(a-=1)*a*a+1},$EaseInOutCubic:function(a){return(a*=2)<1?1/2*a*a*a:1/2*((a-=2)*a*a+2)},$EaseInQuart:function(a){return a*a*a*a},$EaseOutQuart:function(a){return-((a-=1)*a*a*a-1)},$EaseInOutQuart:function(a){return(a*=2)<1?1/2*a*a*a*a:-1/2*((a-=2)*a*a*a-2)},$EaseInQuint:function(a){return a*a*a*a*a},$EaseOutQuint:function(a){return(a-=1)*a*a*a*a+1},$EaseInOutQuint:function(a){return(a*=2)<1?1/2*a*a*a*a*a:1/2*((a-=2)*a*a*a*a+2)},$EaseInSine:function(a){return 1-c.cos(a*c.PI/2)},$EaseOutSine:function(a){return c.sin(a*c.PI/2)},$EaseInOutSine:function(a){return-1/2*(c.cos(c.PI*a)-1)},$EaseInExpo:function(a){return a==0?0:c.pow(2,10*(a-1))},$EaseOutExpo:function(a){return a==1?1:-c.pow(2,-10*a)+1},$EaseInOutExpo:function(a){return a==0||a==1?a:(a*=2)<1?1/2*c.pow(2,10*(a-1)):1/2*(-c.pow(2,-10*--a)+2)},$EaseInCirc:function(a){return-(c.sqrt(1-a*a)-1)},$EaseOutCirc:function(a){return c.sqrt(1-(a-=1)*a)},$EaseInOutCirc:function(a){return(a*=2)<1?-1/2*(c.sqrt(1-a*a)-1):1/2*(c.sqrt(1-(a-=2)*a)+1)},$EaseInElastic:function(a){if(!a||a==1)return a;var b=.3,d=.075;return-(c.pow(2,10*(a-=1))*c.sin((a-d)*2*c.PI/b))},$EaseOutElastic:function(a){if(!a||a==1)return a;var b=.3,d=.075;return c.pow(2,-10*a)*c.sin((a-d)*2*c.PI/b)+1},$EaseInOutElastic:function(a){if(!a||a==1)return a;var b=.45,d=.1125;return(a*=2)<1?-.5*c.pow(2,10*(a-=1))*c.sin((a-d)*2*c.PI/b):c.pow(2,-10*(a-=1))*c.sin((a-d)*2*c.PI/b)*.5+1},$EaseInBack:function(a){var b=1.70158;return a*a*((b+1)*a-b)},$EaseOutBack:function(a){var b=1.70158;return(a-=1)*a*((b+1)*a+b)+1},$EaseInOutBack:function(a){var b=1.70158;return(a*=2)<1?1/2*a*a*(((b*=1.525)+1)*a-b):1/2*((a-=2)*a*(((b*=1.525)+1)*a+b)+2)},$EaseInBounce:function(a){return 1-e.$EaseOutBounce(1-a)},$EaseOutBounce:function(a){return a<1/2.75?7.5625*a*a:a<2/2.75?7.5625*(a-=1.5/2.75)*a+.75:a<2.5/2.75?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},$EaseInOutBounce:function(a){return a<1/2?e.$EaseInBounce(a*2)*.5:e.$EaseOutBounce(a*2-1)*.5+.5},$EaseGoBack:function(a){return 1-c.abs(2-1)},$EaseInWave:function(a){return 1-c.cos(a*c.PI*2)},$EaseOutWave:function(a){return c.sin(a*c.PI*2)},$EaseOutJump:function(a){return 1-((a*=2)<1?(a=1-a)*a*a:(a-=1)*a*a)},$EaseInJump:function(a){return(a*=2)<1?a*a*a:(a=2-a)*a*a}},h=i.$Jease$={$Swing:e.$EaseSwing,$Linear:e.$EaseLinear,$InQuad:e.$EaseInQuad,$OutQuad:e.$EaseOutQuad,$InOutQuad:e.$EaseInOutQuad,$InCubic:e.$EaseInCubic,$OutCubic:e.$EaseOutCubic,$InOutCubic:e.$EaseInOutCubic,$InQuart:e.$EaseInQuart,$OutQuart:e.$EaseOutQuart,$InOutQuart:e.$EaseInOutQuart,$InQuint:e.$EaseInQuint,$OutQuint:e.$EaseOutQuint,$InOutQuint:e.$EaseInOutQuint,$InSine:e.$EaseInSine,$OutSine:e.$EaseOutSine,$InOutSine:e.$EaseInOutSine,$InExpo:e.$EaseInExpo,$OutExpo:e.$EaseOutExpo,$InOutExpo:e.$EaseInOutExpo,$InCirc:e.$EaseInCirc,$OutCirc:e.$EaseOutCirc,$InOutCirc:e.$EaseInOutCirc,$InElastic:e.$EaseInElastic,$OutElastic:e.$EaseOutElastic,$InOutElastic:e.$EaseInOutElastic,$InBack:e.$EaseInBack,$OutBack:e.$EaseOutBack,$InOutBack:e.$EaseInOutBack,$InBounce:e.$EaseInBounce,$OutBounce:e.$EaseOutBounce,$InOutBounce:e.$EaseInOutBounce,$GoBack:e.$EaseGoBack,$InWave:e.$EaseInWave,$OutWave:e.$EaseOutWave,$OutJump:e.$EaseOutJump,$InJump:e.$EaseInJump};var b=new function(){var h=this,Ab=/\S+/g,L=1,jb=2,nb=3,mb=4,rb=5,M,s=0,j=0,t=0,z=0,A=0,D=navigator,vb=D.appName,o=D.userAgent,q=parseFloat;function Jb(){if(!M){M={Wg:"ontouchstart"in i||"createTouch"in g};var a;if(D.pointerEnabled||(a=D.msPointerEnabled))M.Ed=a?"msTouchAction":"touchAction"}return M}function v(h){if(!s){s=-1;if(vb=="Microsoft Internet Explorer"&&!!i.attachEvent&&!!i.ActiveXObject){var e=o.indexOf("MSIE");s=L;t=q(o.substring(e+5,o.indexOf(";",e)));j=g.documentMode||t}else if(vb=="Netscape"&&!!i.addEventListener){var d=o.indexOf("Firefox"),b=o.indexOf("Safari"),f=o.indexOf("Chrome"),c=o.indexOf("AppleWebKit");if(d>=0){s=jb;j=q(o.substring(d+8))}else if(b>=0){var k=o.substring(0,b).lastIndexOf("/");s=f>=0?mb:nb;j=q(o.substring(k+1,b))}else{var a=/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/i.exec(o);if(a){s=L;j=t=q(a[1])}}if(c>=0)A=q(o.substring(c+12))}else{var a=/(opera)(?:.*version|)[ \/]([\w.]+)/i.exec(o);if(a){s=rb;j=q(a[2])}}}return h==s}function r(){return v(L)}function S(){return r()&&(j<6||g.compatMode=="BackCompat")}function lb(){return v(nb)}function qb(){return v(rb)}function gb(){return lb()&&A>534&&A<535}function H(){v();return A>537||j>42||s==L&&j>=11}function Q(){return r()&&j<9}function hb(a){var b,c;return function(g){if(!b){b=d;var e=a.substr(0,1).toUpperCase()+a.substr(1);n([a].concat(["WebKit","ms","Moz","O","webkit"]),function(h,d){var b=a;if(d)b=h+e;if(g.style[b]!=f)return c=b})}return c}}function eb(b){var a;return function(c){a=a||hb(b)(c)||b;return a}}var N=eb("transform");function ub(a){return{}.toString.call(a)}var K;function Gb(){if(!K){K={};n(["Boolean","Number","String","Function","Array","Date","RegExp","Object"],function(a){K["[object "+a+"]"]=a.toLowerCase()})}return K}function n(b,d){var a,c;if(ub(b)=="[object Array]"){for(a=0;a<b.length;a++)if(c=d(b[a],a,b))return c}else for(a in b)if(c=d(b[a],a,b))return c}function F(a){return a==k?String(a):Gb()[ub(a)]||"object"}function sb(a){for(var b in a)return d}function B(a){try{return F(a)=="object"&&!a.nodeType&&a!=a.window&&(!a.constructor||{}.hasOwnProperty.call(a.constructor.prototype,"isPrototypeOf"))}catch(b){}}function p(a,b){return{x:a,y:b}}function yb(b,a){setTimeout(b,a||0)}function C(b,d,c){var a=!b||b=="inherit"?"":b;n(d,function(c){var b=c.exec(a);if(b){var d=a.substr(0,b.index),e=a.substr(b.index+b[0].length+1,a.length-1);a=d+e}});a=c+(!a.indexOf(" ")?"":" ")+a;return a}function T(b,a){if(j<9)b.style.filter=a}h.Sg=Jb;h.Cd=r;h.Ug=lb;h.Bc=qb;h.rg=H;h.hb=Q;hb("transform");h.xd=function(){return j};h.ug=function(){v();return A};h.$Delay=yb;function ab(a){a.constructor===ab.caller&&a.Pd&&a.Pd.apply(a,ab.caller.arguments)}h.Pd=ab;h.mb=function(a){if(h.yd(a))a=g.getElementById(a);return a};function u(a){return a||i.event}h.zd=u;h.Ec=function(b){b=u(b);var a=b.target||b.srcElement||g;if(a.nodeType==3)a=h.Dc(a);return a};h.Sd=function(a){a=u(a);return{x:a.pageX||a.clientX||0,y:a.pageY||a.clientY||0}};function G(c,d,a){if(a!==f)c.style[d]=a==f?"":a;else{var b=c.currentStyle||c.style;a=b[d];if(a==""&&i.getComputedStyle){b=c.ownerDocument.defaultView.getComputedStyle(c,k);b&&(a=b.getPropertyValue(d)||b[d])}return a}}function cb(b,c,a,d){if(a!==f){if(a==k)a="";else d&&(a+="px");G(b,c,a)}else return q(G(b,c))}function m(c,a){var d=a?cb:G,b;if(a&4)b=eb(c);return function(e,f){return d(e,b?b(e):c,f,a&2)}}function Db(b){if(r()&&t<9){var a=/opacity=([^)]*)/.exec(b.style.filter||"");return a?q(a[1])/100:1}else return q(b.style.opacity||"1")}function Fb(b,a,f){if(r()&&t<9){var h=b.style.filter||"",i=new RegExp(/[\s]*alpha\([^\)]*\)/g),e=c.round(100*a),d="";if(e<100||f)d="alpha(opacity="+e+") ";var g=C(h,[i],d);T(b,g)}else b.style.opacity=a==1?"":c.round(a*100)/100}var O={$Rotate:["rotate"],$RotateX:["rotateX"],$RotateY:["rotateY"],$SkewX:["skewX"],$SkewY:["skewY"]};if(!H())O=E(O,{$ScaleX:["scaleX",2],$ScaleY:["scaleY",2],$TranslateZ:["translateZ",1]});function P(d,a){var c="";if(a){if(r()&&j&&j<10){delete a.$RotateX;delete a.$RotateY;delete a.$TranslateZ}b.c(a,function(d,e){var a=O[e];if(a){var b=a[1]||0;if(d||b)c+=" "+a[0]+"("+d+(["deg","px",""])[b]+")"}});if(H()){if(a.$TranslateX||a.$TranslateY||a.$TranslateZ)c+=" translate3d("+(a.$TranslateX||0)+"px,"+(a.$TranslateY||0)+"px,"+(a.$TranslateZ||0)+"px)";if(a.$ScaleX==f)a.$ScaleX=1;if(a.$ScaleY==f)a.$ScaleY=1;if(a.$ScaleX!=1||a.$ScaleY!=1)c+=" scale3d("+a.$ScaleX+", "+a.$ScaleY+", 1)"}}d.style[N(d)]=c}h.Nd=m("transformOrigin",4);h.og=m("backfaceVisibility",4);h.ng=m("transformStyle",4);h.Eg=m("perspective",6);h.Dg=m("perspectiveOrigin",4);h.Cg=function(a,b){if(r()&&t<9||t<10&&S())a.style.zoom=b==1?"":b;else{var c=N(a),f="scale("+b+")",e=a.style[c],g=new RegExp(/[\s]*scale\(.*?\)/g),d=C(e,[g],f);a.style[c]=d}};h.Rb=function(b,a){return function(c){c=u(c);var e=c.type,d=c.relatedTarget||(e=="mouseout"?c.toElement:c.fromElement);(!d||d!==a&&!h.Og(a,d))&&b(c)}};h.g=function(a,c,d,b){a=h.mb(a);if(a.addEventListener){c=="mousewheel"&&a.addEventListener("DOMMouseScroll",d,b);a.addEventListener(c,d,b)}else if(a.attachEvent){a.attachEvent("on"+c,d);b&&a.setCapture&&a.setCapture()}};h.Q=function(a,c,d,b){a=h.mb(a);if(a.removeEventListener){c=="mousewheel"&&a.removeEventListener("DOMMouseScroll",d,b);a.removeEventListener(c,d,b)}else if(a.detachEvent){a.detachEvent("on"+c,d);b&&a.releaseCapture&&a.releaseCapture()}};h.Pb=function(a){a=u(a);a.preventDefault&&a.preventDefault();a.cancel=d;a.returnValue=l};h.yg=function(a){a=u(a);a.stopPropagation&&a.stopPropagation();a.cancelBubble=d};h.H=function(d,c){var a=[].slice.call(arguments,2),b=function(){var b=a.concat([].slice.call(arguments,0));return c.apply(d,b)};return b};h.xg=function(a,b){if(b==f)return a.textContent||a.innerText;var c=g.createTextNode(b);h.sc(a);a.appendChild(c)};h.V=function(d,c){for(var b=[],a=d.firstChild;a;a=a.nextSibling)(c||a.nodeType==1)&&b.push(a);return b};function tb(a,c,e,b){b=b||"u";for(a=a?a.firstChild:k;a;a=a.nextSibling)if(a.nodeType==1){if(X(a,b)==c)return a;if(!e){var d=tb(a,c,e,b);if(d)return d}}}h.B=tb;function V(a,d,f,b){b=b||"u";var c=[];for(a=a?a.firstChild:k;a;a=a.nextSibling)if(a.nodeType==1){X(a,b)==d&&c.push(a);if(!f){var e=V(a,d,f,b);if(e.length)c=c.concat(e)}}return c}function ob(a,c,d){for(a=a?a.firstChild:k;a;a=a.nextSibling)if(a.nodeType==1){if(a.tagName==c)return a;if(!d){var b=ob(a,c,d);if(b)return b}}}h.zg=ob;function ib(a,c,e){var b=[];for(a=a?a.firstChild:k;a;a=a.nextSibling)if(a.nodeType==1){(!c||a.tagName==c)&&b.push(a);if(!e){var d=ib(a,c,e);if(d.length)b=b.concat(d)}}return b}h.Bg=ib;h.wg=function(b,a){return b.getElementsByTagName(a)};function E(){var e=arguments,d,c,b,a,h=1&e[0],g=1+h;d=e[g-1]||{};for(;g<e.length;g++)if(c=e[g])for(b in c){a=c[b];if(a!==f){a=c[b];var i=d[b];d[b]=h&&(B(i)||B(a))?E(h,{},i,a):a}}return d}h.p=E;function bb(f,g){var d={},c,a,b;for(c in f){a=f[c];b=g[c];if(a!==b){var e;if(B(a)&&B(b)){a=bb(a,b);e=!sb(a)}!e&&(d[c]=a)}}return d}h.fd=function(a){return F(a)=="function"};h.xc=function(a){return F(a)=="array"};h.yd=function(a){return F(a)=="string"};h.cc=function(a){return!isNaN(q(a))&&isFinite(a)};h.c=n;h.Gg=B;function U(a){return g.createElement(a)}h.tb=function(){return U("DIV")};h.Hg=function(){return U("SPAN")};h.ld=function(){};function Y(b,c,a){if(a==f)return b.getAttribute(c);b.setAttribute(c,a)}function X(a,b){return Y(a,b)||Y(a,"data-"+b)}h.G=Y;h.j=X;function x(b,a){if(a==f)return b.className;b.className=a}h.id=x;function xb(b){var a={};n(b,function(b){a[b]=b});return a}function zb(b,a){return b.match(a||Ab)}function R(b,a){return xb(zb(b||"",a))}h.pg=zb;function db(b,c){var a="";n(c,function(c){a&&(a+=b);a+=c});return a}function J(a,c,b){x(a,db(" ",E(bb(R(x(a)),R(c)),R(b))))}h.Dc=function(a){return a.parentNode};h.S=function(a){h.bb(a,"none")};h.E=function(a,b){h.bb(a,b?"none":"")};h.tg=function(b,a){b.removeAttribute(a)};h.sg=function(){return r()&&j<10};h.Tg=function(d,a){if(a)d.style.clip="rect("+c.round(a.$Top)+"px "+c.round(a.$Right)+"px "+c.round(a.$Bottom)+"px "+c.round(a.$Left)+"px)";else{var g=d.style.cssText,f=[new RegExp(/[\s]*clip: rect\(.*?\)[;]?/i),new RegExp(/[\s]*cliptop: .*?[;]?/i),new RegExp(/[\s]*clipright: .*?[;]?/i),new RegExp(/[\s]*clipbottom: .*?[;]?/i),new RegExp(/[\s]*clipleft: .*?[;]?/i)],e=C(g,f,"");b.gc(d,e)}};h.R=function(){return+new Date};h.L=function(b,a){b.appendChild(a)};h.dc=function(b,a,c){(c||a.parentNode).insertBefore(b,a)};h.Kb=function(b,a){a=a||b.parentNode;a&&a.removeChild(b)};h.Xg=function(a,b){n(a,function(a){h.Kb(a,b)})};h.sc=function(a){h.Xg(h.V(a,d),a)};h.Pg=function(a,b){var c=h.Dc(a);b&1&&h.D(a,(h.k(c)-h.k(a))/2);b&2&&h.C(a,(h.l(c)-h.l(a))/2)};h.ic=function(b,a){return parseInt(b,a||10)};h.qc=q;h.Og=function(b,a){var c=g.body;while(a&&b!==a&&c!==a)try{a=a.parentNode}catch(d){return l}return b===a};function Z(d,c,b){var a=d.cloneNode(!c);!b&&h.tg(a,"id");return a}h.fb=Z;h.Mb=function(e,f){var a=new Image;function b(e,d){h.Q(a,"load",b);h.Q(a,"abort",c);h.Q(a,"error",c);f&&f(a,d)}function c(a){b(a,d)}if(qb()&&j<11.6||!e)b(!e);else{h.g(a,"load",b);h.g(a,"abort",c);h.g(a,"error",c);a.src=e}};h.fe=function(d,a,e){var c=d.length+1;function b(b){c--;if(a&&b&&b.src==a.src)a=b;!c&&e&&e(a)}n(d,function(a){h.Mb(a.src,b)});b()};h.Zc=function(a,g,i,h){if(h)a=Z(a);var c=V(a,g);if(!c.length)c=b.wg(a,g);for(var f=c.length-1;f>-1;f--){var d=c[f],e=Z(i);x(e,x(d));b.gc(e,d.style.cssText);b.dc(e,d);b.Kb(d)}return a};function Hb(a){var l=this,p="",r=["av","pv","ds","dn"],e=[],q,k=0,i=0,d=0;function j(){J(a,q,e[d||k||i&2||i]);b.Y(a,"pointer-events",d?"none":"")}function c(){k=0;j();h.Q(g,"mouseup",c);h.Q(g,"touchend",c);h.Q(g,"touchcancel",c)}function o(a){if(d)h.Pb(a);else{k=4;j();h.g(g,"mouseup",c);h.g(g,"touchend",c);h.g(g,"touchcancel",c)}}l.qd=function(a){if(a===f)return i;i=a&2||a&1;j()};l.$Enable=function(a){if(a===f)return!d;d=a?0:3;j()};l.$Elmt=a=h.mb(a);var m=b.pg(x(a));if(m)p=m.shift();n(r,function(a){e.push(p+a)});q=db(" ",e);e.unshift("");h.g(a,"mousedown",o);h.g(a,"touchstart",o)}h.ec=function(a){return new Hb(a)};h.Y=G;h.rb=m("overflow");h.C=m("top",2);h.D=m("left",2);h.k=m("width",2);h.l=m("height",2);h.Yg=m("marginLeft",2);h.Vg=m("marginTop",2);h.F=m("position");h.bb=m("display");h.K=m("zIndex",1);h.Cb=function(b,a,c){if(a!=f)Fb(b,a,c);else return Db(b)};h.gc=function(a,b){if(b!=f)a.style.cssText=b;else return a.style.cssText};var W={$Opacity:h.Cb,$Top:h.C,$Left:h.D,W:h.k,X:h.l,zb:h.F,Ph:h.bb,$ZIndex:h.K};h.Re=function(c,b){var a={};n(b,function(d,b){if(W[b])a[b]=W[b](c)});return a};var w=function(g,l){var e=Q(),b=H(),d=gb(),i=N(g);function j(b,d,a){var e=b.nb(p(-d/2,-a/2)),f=b.nb(p(d/2,-a/2)),g=b.nb(p(d/2,a/2)),h=b.nb(p(-d/2,a/2));b.nb(p(300,300));return p(c.min(e.x,f.x,g.x,h.x)+d/2,c.min(e.y,f.y,g.y,h.y)+a/2)}function a(d,a){a=a||{};var g=a.$TranslateZ||0,l=(a.$RotateX||0)%360,m=(a.$RotateY||0)%360,o=(a.$Rotate||0)%360,p=a.Qh;if(e){g=0;l=0;m=0;p=0}var c=new Cb(a.$TranslateX,a.$TranslateY,g);c.$RotateX(l);c.$RotateY(m);c.Ke(o);c.Ne(a.$SkewX,a.$SkewY);c.$Scale(a.$ScaleX,a.$ScaleY,p);if(b){c.$Move(a.Db,a.Bb);d.style[i]=c.pe()}else if(!z||z<9){var k="";if(o||a.$ScaleX!=f&&a.$ScaleX!=1||a.$ScaleY!=f&&a.$ScaleY!=1){var n=j(c,a.$OriginalWidth,a.$OriginalHeight);h.Vg(d,n.y);h.Yg(d,n.x);k=c.se()}var r=d.style.filter,s=new RegExp(/[\s]*progid:DXImageTransform\.Microsoft\.Matrix\([^\)]*\)/g),q=C(r,[s],k);T(d,q)}}w=function(e,c){c=c||{};var i=c.Db,j=c.Bb,g;n(W,function(a,b){g=c[b];g!==f&&a(e,g)});h.Tg(e,c.$Clip);if(!b){i!=f&&h.D(e,c.Qd+i);j!=f&&h.C(e,c.Td+j)}if(c.ye)if(d)yb(h.H(k,P,e,c));else a(e,c)};h.yb=P;if(d)h.yb=w;if(e)h.yb=a;else if(!b)a=P;h.N=w;w(g,l)};h.yb=w;h.N=w;function Cb(j,l,p){var d=this,b=[1,0,0,0,0,1,0,0,0,0,1,0,j||0,l||0,p||0,1],i=c.sin,h=c.cos,m=c.tan;function g(a){return a*c.PI/180}function o(a,b){return{x:a,y:b}}function n(b,c,f,g,i,l,n,o,q,t,u,w,y,A,C,F,a,d,e,h,j,k,m,p,r,s,v,x,z,B,D,E){return[b*a+c*j+f*r+g*z,b*d+c*k+f*s+g*B,b*e+c*m+f*v+g*D,b*h+c*p+f*x+g*E,i*a+l*j+n*r+o*z,i*d+l*k+n*s+o*B,i*e+l*m+n*v+o*D,i*h+l*p+n*x+o*E,q*a+t*j+u*r+w*z,q*d+t*k+u*s+w*B,q*e+t*m+u*v+w*D,q*h+t*p+u*x+w*E,y*a+A*j+C*r+F*z,y*d+A*k+C*s+F*B,y*e+A*m+C*v+F*D,y*h+A*p+C*x+F*E]}function e(c,a){return n.apply(k,(a||b).concat(c))}d.$Scale=function(a,c,d){if(a==f)a=1;if(c==f)c=1;if(d==f)d=1;if(a!=1||c!=1||d!=1)b=e([a,0,0,0,0,c,0,0,0,0,d,0,0,0,0,1])};d.$Move=function(a,c,d){b[12]+=a||0;b[13]+=c||0;b[14]+=d||0};d.$RotateX=function(c){if(c){a=g(c);var d=h(a),f=i(a);b=e([1,0,0,0,0,d,f,0,0,-f,d,0,0,0,0,1])}};d.$RotateY=function(c){if(c){a=g(c);var d=h(a),f=i(a);b=e([d,0,-f,0,0,1,0,0,f,0,d,0,0,0,0,1])}};d.Ke=function(c){if(c){a=g(c);var d=h(a),f=i(a);b=e([d,f,0,0,-f,d,0,0,0,0,1,0,0,0,0,1])}};d.Ne=function(a,c){if(a||c){j=g(a);l=g(c);b=e([1,m(l),0,0,m(j),1,0,0,0,0,1,0,0,0,0,1])}};d.nb=function(c){var a=e(b,[1,0,0,0,0,1,0,0,0,0,1,0,c.x,c.y,0,1]);return o(a[12],a[13])};d.pe=function(){return"matrix3d("+b.join(",")+")"};d.se=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+b[0]+", M12="+b[4]+", M21="+b[1]+", M22="+b[5]+", SizingMethod='auto expand')"}}new(function(){var a=this;function b(d,g){for(var j=d[0].length,i=d.length,h=g[0].length,f=[],c=0;c<i;c++)for(var k=f[c]=[],b=0;b<h;b++){for(var e=0,a=0;a<j;a++)e+=d[c][a]*g[a][b];k[b]=e}return f}a.$ScaleX=function(b,c){return a.wd(b,c,0)};a.$ScaleY=function(b,c){return a.wd(b,0,c)};a.wd=function(a,c,d){return b(a,[[c,0],[0,d]])};a.nb=function(d,c){var a=b(d,[[c.x],[c.y]]);return p(a[0][0],a[1][0])}});var fb={Qd:0,Td:0,Db:0,Bb:0,$Zoom:1,$ScaleX:1,$ScaleY:1,$Rotate:0,$RotateX:0,$RotateY:0,$TranslateX:0,$TranslateY:0,$TranslateZ:0,$SkewX:0,$SkewY:0};h.Ac=function(a){var c=a||{};if(a)if(b.fd(a))c={qb:c};else if(b.fd(a.$Clip))c.$Clip={qb:a.$Clip};return c};function wb(c,a){var b={};n(c,function(c,d){var e=c;if(a[d]!=f)if(h.cc(c))e=c+a[d];else e=wb(c,a[d]);b[d]=e});return b}h.we=wb;h.Jd=function(l,m,w,n,y,z,o){var a=m;if(l){a={};for(var h in m){var A=z[h]||1,v=y[h]||[0,1],g=(w-v[0])/v[1];g=c.min(c.max(g,0),1);g=g*A;var u=c.floor(g);if(g!=u)g-=u;var i=n.qb||e.$EaseSwing,j,B=l[h],q=m[h];if(b.cc(q)){i=n[h]||i;var x=i(g);j=B+q*x}else{j=b.p({Ob:{}},l[h]);b.c(q.Ob||q,function(d,a){if(n.$Clip)i=n.$Clip[a]||n.$Clip.qb||i;var c=i(g),b=d*c;j.Ob[a]=b;j[a]+=b})}a[h]=j}var t=b.c(m,function(b,a){return fb[a]!=f});t&&b.c(fb,function(c,b){if(a[b]==f&&l[b]!==f)a[b]=l[b]});if(t){if(a.$Zoom)a.$ScaleX=a.$ScaleY=a.$Zoom;a.$OriginalWidth=o.$OriginalWidth;a.$OriginalHeight=o.$OriginalHeight;a.ye=d}}if(m.$Clip&&o.$Move){var p=a.$Clip.Ob,s=(p.$Top||0)+(p.$Bottom||0),r=(p.$Left||0)+(p.$Right||0);a.$Left=(a.$Left||0)+r;a.$Top=(a.$Top||0)+s;a.$Clip.$Left-=r;a.$Clip.$Right-=r;a.$Clip.$Top-=s;a.$Clip.$Bottom-=s}if(a.$Clip&&b.sg()&&!a.$Clip.$Top&&!a.$Clip.$Left&&a.$Clip.$Right==o.$OriginalWidth&&a.$Clip.$Bottom==o.$OriginalHeight)a.$Clip=k;return a}};function n(){var a=this,d=[];function h(a,b){d.push({uc:a,tc:b})}function g(a,c){b.c(d,function(b,e){b.uc==a&&b.tc===c&&d.splice(e,1)})}a.$On=a.addEventListener=h;a.$Off=a.removeEventListener=g;a.n=function(a){var c=[].slice.call(arguments,1);b.c(d,function(b){b.uc==a&&b.tc.apply(i,c)})}}var m=function(z,C,h,L,O,J){z=z||0;var a=this,q,n,o,v,A=0,H,I,G,B,y=0,g=0,m=0,D,j,f,e,p,w=[],x;function P(a){f+=a;e+=a;j+=a;g+=a;m+=a;y+=a}function u(o){var i=o;if(p&&(i>=e||i<=f))i=((i-f)%p+p)%p+f;if(!D||v||g!=i){var k=c.min(i,e);k=c.max(k,f);if(!D||v||k!=m){if(J){var l=(k-j)/(C||1);if(h.$Reverse)l=1-l;var n=b.Jd(O,J,l,H,G,I,h);if(x)b.c(n,function(b,a){x[a]&&x[a](L,b)});else b.N(L,n)}a.Oc(m-j,k-j);m=k;b.c(w,function(b,c){var a=o<g?w[w.length-c-1]:b;a.v(m-y)});var r=g,q=m;g=i;D=d;a.Qb(r,q)}}}function E(a,b,d){b&&a.$Shift(e);if(!d){f=c.min(f,a.Jc()+y);e=c.max(e,a.db()+y)}w.push(a)}var r=i.requestAnimationFrame||i.webkitRequestAnimationFrame||i.mozRequestAnimationFrame||i.msRequestAnimationFrame;if(b.Ug()&&b.xd()<7)r=k;r=r||function(a){b.$Delay(a,h.$Interval)};function K(){if(q){var d=b.R(),e=c.min(d-A,h.Vc),a=g+e*o;A=d;if(a*o>=n*o)a=n;u(a);if(!v&&a*o>=n*o)M(B);else r(K)}}function t(h,i,j){if(!q){q=d;v=j;B=i;h=c.max(h,f);h=c.min(h,e);n=h;o=n<g?-1:1;a.gd();A=b.R();r(K)}}function M(b){if(q){v=q=B=l;a.dd();b&&b()}}a.$Play=function(a,b,c){t(a?g+a:e,b,c)};a.kd=t;a.ob=M;a.ie=function(a){t(a)};a.cb=function(){return g};a.od=function(){return n};a.Gb=function(){return m};a.v=u;a.$Move=function(a){u(g+a)};a.$IsPlaying=function(){return q};a.ge=function(a){p=a};a.$Shift=P;a.I=function(a,b){E(a,0,b)};a.Kc=function(a){E(a,1)};a.ee=function(a){e+=a};a.Jc=function(){return f};a.db=function(){return e};a.Qb=a.gd=a.dd=a.Oc=b.ld;a.Rc=b.R();h=b.p({$Interval:16,Vc:50},h);p=h.nd;x=h.Wd;f=j=z;e=z+C;I=h.$Round||{};G=h.$During||{};H=b.Ac(h.$Easing)};var p=i.$JssorSlideshowFormations$=new function(){var h=this,b=0,a=1,f=2,e=3,s=1,r=2,t=4,q=8,w=256,x=512,v=1024,u=2048,j=u+s,i=u+r,o=x+s,m=x+r,n=w+t,k=w+q,l=v+t,p=v+q;function y(a){return(a&r)==r}function z(a){return(a&t)==t}function g(b,a,c){c.push(a);b[a]=b[a]||[];b[a].push(c)}h.$FormationStraight=function(f){for(var d=f.$Cols,e=f.$Rows,s=f.$Assembly,t=f.Wb,r=[],a=0,b=0,p=d-1,q=e-1,h=t-1,c,b=0;b<e;b++)for(a=0;a<d;a++){switch(s){case j:c=h-(a*e+(q-b));break;case l:c=h-(b*d+(p-a));break;case o:c=h-(a*e+b);case n:c=h-(b*d+a);break;case i:c=a*e+b;break;case k:c=b*d+(p-a);break;case m:c=a*e+(q-b);break;default:c=b*d+a}g(r,c,[b,a])}return r};h.$FormationSwirl=function(q){var x=q.$Cols,y=q.$Rows,B=q.$Assembly,w=q.Wb,A=[],z=[],u=0,c=0,h=0,r=x-1,s=y-1,t,p,v=0;switch(B){case j:c=r;h=0;p=[f,a,e,b];break;case l:c=0;h=s;p=[b,e,a,f];break;case o:c=r;h=s;p=[e,a,f,b];break;case n:c=r;h=s;p=[a,e,b,f];break;case i:c=0;h=0;p=[f,b,e,a];break;case k:c=r;h=0;p=[a,f,b,e];break;case m:c=0;h=s;p=[e,b,f,a];break;default:c=0;h=0;p=[b,f,a,e]}u=0;while(u<w){t=h+","+c;if(c>=0&&c<x&&h>=0&&h<y&&!z[t]){z[t]=d;g(A,u++,[h,c])}else switch(p[v++%p.length]){case b:c--;break;case f:h--;break;case a:c++;break;case e:h++}switch(p[v%p.length]){case b:c++;break;case f:h++;break;case a:c--;break;case e:h--}}return A};h.$FormationZigZag=function(p){var w=p.$Cols,x=p.$Rows,z=p.$Assembly,v=p.Wb,t=[],u=0,c=0,d=0,q=w-1,r=x-1,y,h,s=0;switch(z){case j:c=q;d=0;h=[f,a,e,a];break;case l:c=0;d=r;h=[b,e,a,e];break;case o:c=q;d=r;h=[e,a,f,a];break;case n:c=q;d=r;h=[a,e,b,e];break;case i:c=0;d=0;h=[f,b,e,b];break;case k:c=q;d=0;h=[a,f,b,f];break;case m:c=0;d=r;h=[e,b,f,b];break;default:c=0;d=0;h=[b,f,a,f]}u=0;while(u<v){y=d+","+c;if(c>=0&&c<w&&d>=0&&d<x&&typeof t[y]=="undefined"){g(t,u++,[d,c]);switch(h[s%h.length]){case b:c++;break;case f:d++;break;case a:c--;break;case e:d--}}else{switch(h[s++%h.length]){case b:c--;break;case f:d--;break;case a:c++;break;case e:d++}switch(h[s++%h.length]){case b:c++;break;case f:d++;break;case a:c--;break;case e:d--}}}return t};h.$FormationStraightStairs=function(q){var u=q.$Cols,v=q.$Rows,e=q.$Assembly,t=q.Wb,r=[],s=0,c=0,d=0,f=u-1,h=v-1,x=t-1;switch(e){case j:case m:case o:case i:var a=0,b=0;break;case k:case l:case n:case p:var a=f,b=0;break;default:e=p;var a=f,b=0}c=a;d=b;while(s<t){if(z(e)||y(e))g(r,x-s++,[d,c]);else g(r,s++,[d,c]);switch(e){case j:case m:c--;d++;break;case o:case i:c++;d--;break;case k:case l:c--;d--;break;case p:case n:default:c++;d++}if(c<0||d<0||c>f||d>h){switch(e){case j:case m:a++;break;case k:case l:case o:case i:b++;break;case p:case n:default:a--}if(a<0||b<0||a>f||b>h){switch(e){case j:case m:a=f;b++;break;case o:case i:b=h;a++;break;case k:case l:b=h;a--;break;case p:case n:default:a=0;b++}if(b>h)b=h;else if(b<0)b=0;else if(a>f)a=f;else if(a<0)a=0}d=b;c=a}}return r};h.$FormationSquare=function(i){var a=i.$Cols||1,b=i.$Rows||1,j=[],d,e,f,h,k;f=a<b?(b-a)/2:0;h=a>b?(a-b)/2:0;k=c.round(c.max(a/2,b/2))+1;for(d=0;d<a;d++)for(e=0;e<b;e++)g(j,k-c.min(d+1+f,e+1+h,a-d+f,b-e+h),[e,d]);return j};h.$FormationRectangle=function(f){var d=f.$Cols||1,e=f.$Rows||1,h=[],a,b,i;i=c.round(c.min(d/2,e/2))+1;for(a=0;a<d;a++)for(b=0;b<e;b++)g(h,i-c.min(a+1,b+1,d-a,e-b),[b,a]);return h};h.$FormationRandom=function(d){for(var e=[],a,b=0;b<d.$Rows;b++)for(a=0;a<d.$Cols;a++)g(e,c.ceil(1e5*c.random())%13,[b,a]);return e};h.$FormationCircle=function(d){for(var e=d.$Cols||1,f=d.$Rows||1,h=[],a,i=e/2-.5,j=f/2-.5,b=0;b<e;b++)for(a=0;a<f;a++)g(h,c.round(c.sqrt(c.pow(b-i,2)+c.pow(a-j,2))),[a,b]);return h};h.$FormationCross=function(d){for(var e=d.$Cols||1,f=d.$Rows||1,h=[],a,i=e/2-.5,j=f/2-.5,b=0;b<e;b++)for(a=0;a<f;a++)g(h,c.round(c.min(c.abs(b-i),c.abs(a-j))),[a,b]);return h};h.$FormationRectangleCross=function(f){for(var h=f.$Cols||1,i=f.$Rows||1,j=[],a,d=h/2-.5,e=i/2-.5,k=c.max(d,e)+1,b=0;b<h;b++)for(a=0;a<i;a++)g(j,c.round(k-c.max(d-c.abs(b-d),e-c.abs(a-e)))-1,[a,b]);return j}};i.$JssorSlideshowRunner$=function(j,s,q,t,y){var f=this,u,g,a,x=0,w=t.$TransitionsOrder,r,h=8;function i(g,f){var a={$Interval:f,$Duration:1,$Delay:0,$Cols:1,$Rows:1,$Opacity:0,$Zoom:0,$Clip:0,$Move:l,$SlideOut:l,$Reverse:l,$Formation:p.$FormationRandom,$Assembly:1032,$ChessMode:{$Column:0,$Row:0},$Easing:e.$EaseSwing,$Round:{},oc:[],$During:{}};b.p(a,g);a.Wb=a.$Cols*a.$Rows;a.$Easing=b.Ac(a.$Easing);a.Oe=c.ceil(a.$Duration/a.$Interval);a.Pe=function(c,b){c/=a.$Cols;b/=a.$Rows;var f=c+"x"+b;if(!a.oc[f]){a.oc[f]={W:c,X:b};for(var d=0;d<a.$Cols;d++)for(var e=0;e<a.$Rows;e++)a.oc[f][e+","+d]={$Top:e*b,$Right:d*c+c,$Bottom:e*b+b,$Left:d*c}}return a.oc[f]};if(a.$Brother){a.$Brother=i(a.$Brother,f);a.$SlideOut=d}return a}function o(B,h,a,w,o,m){var z=this,u,v={},i={},n=[],f,e,s,q=a.$ChessMode.$Column||0,r=a.$ChessMode.$Row||0,g=a.Pe(o,m),p=C(a),D=p.length-1,t=a.$Duration+a.$Delay*D,x=w+t,j=a.$SlideOut,y;x+=50;function C(a){var b=a.$Formation(a);return a.$Reverse?b.reverse():b}z.md=x;z.nc=function(d){d-=w;var e=d<t;if(e||y){y=e;if(!j)d=t-d;var f=c.ceil(d/a.$Interval);b.c(i,function(a,e){var d=c.max(f,a.Ee);d=c.min(d,a.length-1);if(a.pd!=d){if(!a.pd&&!j)b.E(n[e]);else d==a.Fe&&j&&b.S(n[e]);a.pd=d;b.N(n[e],a[d])}})}};h=b.fb(h);b.yb(h,k);if(b.hb()){var E=!h["no-image"],A=b.Bg(h);b.c(A,function(a){(E||a["jssor-slider"])&&b.Cb(a,b.Cb(a),d)})}b.c(p,function(h,k){b.c(h,function(G){var K=G[0],J=G[1],t=K+","+J,n=l,p=l,x=l;if(q&&J%2){if(q&3)n=!n;if(q&12)p=!p;if(q&16)x=!x}if(r&&K%2){if(r&3)n=!n;if(r&12)p=!p;if(r&16)x=!x}a.$Top=a.$Top||a.$Clip&4;a.$Bottom=a.$Bottom||a.$Clip&8;a.$Left=a.$Left||a.$Clip&1;a.$Right=a.$Right||a.$Clip&2;var C=p?a.$Bottom:a.$Top,z=p?a.$Top:a.$Bottom,B=n?a.$Right:a.$Left,A=n?a.$Left:a.$Right;a.$Clip=C||z||B||A;s={};e={$Top:0,$Left:0,$Opacity:1,W:o,X:m};f=b.p({},e);u=b.p({},g[t]);if(a.$Opacity)e.$Opacity=2-a.$Opacity;if(a.$ZIndex){e.$ZIndex=a.$ZIndex;f.$ZIndex=0}var I=a.$Cols*a.$Rows>1||a.$Clip;if(a.$Zoom||a.$Rotate){var H=d;if(b.hb())if(a.$Cols*a.$Rows>1)H=l;else I=l;if(H){e.$Zoom=a.$Zoom?a.$Zoom-1:1;f.$Zoom=1;if(b.hb()||b.Bc())e.$Zoom=c.min(e.$Zoom,2);var N=a.$Rotate||0;e.$Rotate=N*360*(x?-1:1);f.$Rotate=0}}if(I){var h=u.Ob={};if(a.$Clip){var w=a.$ScaleClip||1;if(C&&z){h.$Top=g.X/2*w;h.$Bottom=-h.$Top}else if(C)h.$Bottom=-g.X*w;else if(z)h.$Top=g.X*w;if(B&&A){h.$Left=g.W/2*w;h.$Right=-h.$Left}else if(B)h.$Right=-g.W*w;else if(A)h.$Left=g.W*w}s.$Clip=u;f.$Clip=g[t]}var L=n?1:-1,M=p?1:-1;if(a.x)e.$Left+=o*a.x*L;if(a.y)e.$Top+=m*a.y*M;b.c(e,function(a,c){if(b.cc(a))if(a!=f[c])s[c]=a-f[c]});v[t]=j?f:e;var D=a.Oe,y=c.round(k*a.$Delay/a.$Interval);i[t]=new Array(y);i[t].Ee=y;i[t].Fe=y+D-1;for(var F=0;F<=D;F++){var E=b.Jd(f,s,F/D,a.$Easing,a.$During,a.$Round,{$Move:a.$Move,$OriginalWidth:o,$OriginalHeight:m});E.$ZIndex=E.$ZIndex||1;i[t].push(E)}})});p.reverse();b.c(p,function(a){b.c(a,function(c){var f=c[0],e=c[1],d=f+","+e,a=h;if(e||f)a=b.fb(h);b.N(a,v[d]);b.rb(a,"hidden");b.F(a,"absolute");B.De(a);n[d]=a;b.E(a,!j)})})}function v(){var b=this,c=0;m.call(b,0,u);b.Qb=function(d,b){if(b-c>h){c=b;a&&a.nc(b);g&&g.nc(b)}};b.eb=r}f.Ge=function(){var a=0,b=t.$Transitions,d=b.length;if(w)a=x++%d;else a=c.floor(c.random()*d);b[a]&&(b[a].xb=a);return b[a]};f.de=function(w,x,l,m,b){r=b;b=i(b,h);var k=m.ad,e=l.ad;k["no-image"]=!m.fc;e["no-image"]=!l.fc;var n=k,p=e,v=b,d=b.$Brother||i({},h);if(!b.$SlideOut){n=e;p=k}var t=d.$Shift||0;g=new o(j,p,d,c.max(t-d.$Interval,0),s,q);a=new o(j,n,v,c.max(d.$Interval-t,0),s,q);g.nc(0);a.nc(0);u=c.max(g.md,a.md);f.xb=w};f.Ib=function(){j.Ib();g=k;a=k};f.ae=function(){var b=k;if(a)b=new v;return b};if(b.hb()||b.Bc()||y&&b.ug()<537)h=16;n.call(f);m.call(f,-1e7,1e7)};var j=i.$JssorSlider$=function(p,gc){var h=this;function Fc(){var a=this;m.call(a,-1e8,2e8);a.ke=function(){var b=a.Gb(),d=c.floor(b),f=t(d),e=b-c.floor(b);return{xb:f,Ud:d,zb:e}};a.Qb=function(b,a){var e=c.floor(a);if(e!=a&&a>b)e++;Vb(e,d);h.n(j.$EVT_POSITION_CHANGE,t(a),t(b),a,b)}}function Ec(){var a=this;m.call(a,0,0,{nd:r});b.c(C,function(b){D&1&&b.ge(r);a.Kc(b);b.$Shift(fb/cc)})}function Dc(){var a=this,b=Ub.$Elmt;m.call(a,-1,2,{$Easing:e.$EaseLinear,Wd:{zb:ac},nd:r},b,{zb:1},{zb:-2});a.Xb=b}function rc(o,n){var b=this,e,f,g,i,c;m.call(b,-1e8,2e8,{Vc:100});b.gd=function(){O=d;R=k;h.n(j.$EVT_SWIPE_START,t(w.cb()),w.cb())};b.dd=function(){O=l;i=l;var a=w.ke();h.n(j.$EVT_SWIPE_END,t(w.cb()),w.cb());!a.zb&&Hc(a.Ud,s)};b.Qb=function(j,h){var b;if(i)b=c;else{b=f;if(g){var d=h/g;b=a.$SlideEasing(d)*(f-e)+e}}w.v(b)};b.Ub=function(a,d,c,h){e=a;f=d;g=c;w.v(a);b.v(0);b.kd(c,h)};b.ue=function(a){i=d;c=a;b.$Play(a,k,d)};b.te=function(a){c=a};w=new Fc;w.I(o);w.I(n)}function sc(){var c=this,a=Yb();b.K(a,0);b.Y(a,"pointerEvents","none");c.$Elmt=a;c.De=function(c){b.L(a,c);b.E(a)};c.Ib=function(){b.S(a);b.sc(a)}}function Bc(i,f){var e=this,q,H,x,o,y=[],w,B,W,G,Q,F,g,v,p;m.call(e,-u,u+1,{});function E(a){q&&q.wb();T(i,a,0);F=d;q=new I.$Class(i,I,b.qc(b.j(i,"idle"))||qc);q.v(0)}function Y(){q.Rc<I.Rc&&E()}function N(p,r,n){if(!G){G=d;if(o&&n){var g=n.width,c=n.height,m=g,k=c;if(g&&c&&a.$FillMode){if(a.$FillMode&3&&(!(a.$FillMode&4)||g>K||c>J)){var i=l,q=K/J*c/g;if(a.$FillMode&1)i=q>1;else if(a.$FillMode&2)i=q<1;m=i?g*J/c:K;k=i?J:c*K/g}b.k(o,m);b.l(o,k);b.C(o,(J-k)/2);b.D(o,(K-m)/2)}b.F(o,"absolute");h.n(j.$EVT_LOAD_END,f)}}b.S(r);p&&p(e)}function X(b,c,d,g){if(g==R&&s==f&&P)if(!Gc){var a=t(b);A.de(a,f,c,e,d);c.Be();U.$Shift(a-U.Jc()-1);U.v(a);z.Ub(b,b,0)}}function ab(b){if(b==R&&s==f){if(!g){var a=k;if(A)if(A.xb==f)a=A.ae();else A.Ib();Y();g=new zc(i,f,a,q);g.Wc(p)}!g.$IsPlaying()&&g.Mc()}}function S(d,h,l){if(d==f){if(d!=h)C[h]&&C[h].be();else!l&&g&&g.Vd();p&&p.$Enable();var m=R=b.R();e.Mb(b.H(k,ab,m))}else{var j=c.min(f,d),i=c.max(f,d),o=c.min(i-j,j+r-i),n=u+a.$LazyLoading-1;(!Q||o<=n)&&e.Mb()}}function bb(){if(s==f&&g){g.ob();p&&p.$Quit();p&&p.$Disable();g.Tc()}}function db(){s==f&&g&&g.ob()}function Z(a){!M&&h.n(j.$EVT_CLICK,f,a)}function O(){p=v.pInstance;g&&g.Wc(p)}e.Mb=function(c,a){a=a||x;if(y.length&&!G){b.E(a);if(!W){W=d;h.n(j.$EVT_LOAD_START,f);b.c(y,function(a){if(!b.G(a,"src")){a.src=b.j(a,"src2");b.bb(a,a["display-origin"])}})}b.fe(y,o,b.H(k,N,c,a))}else N(c,a)};e.re=function(){var h=f;if(a.$AutoPlaySteps<0)h-=r;var d=h+a.$AutoPlaySteps*xc;if(D&2)d=t(d);if(!(D&1))d=c.max(0,c.min(d,r-u));if(d!=f){if(A){var e=A.Ge(r);if(e){var i=R=b.R(),g=C[t(d)];return g.Mb(b.H(k,X,d,g,e,i),x)}}nb(d)}};e.Nc=function(){S(f,f,d)};e.be=function(){p&&p.$Quit();p&&p.$Disable();e.Od();g&&g.xe();g=k;E()};e.Be=function(){b.S(i)};e.Od=function(){b.E(i)};e.Yd=function(){p&&p.$Enable()};function T(a,c,e){if(b.G(a,"jssor-slider"))return;if(!F){if(a.tagName=="IMG"){y.push(a);if(!b.G(a,"src")){Q=d;a["display-origin"]=b.bb(a);b.S(a)}}b.hb()&&b.K(a,(b.K(a)||0)+1)}var f=b.V(a);b.c(f,function(f){var h=f.tagName,i=b.j(f,"u");if(i=="player"&&!v){v=f;if(v.pInstance)O();else b.g(v,"dataavailable",O)}if(i=="caption"){if(c){b.Nd(f,b.j(f,"to"));b.og(f,b.j(f,"bf"));b.ng(f,"preserve-3d")}else if(!b.Cd()){var g=b.fb(f,l,d);b.dc(g,f,a);b.Kb(f,a);f=g;c=d}}else if(!F&&!e&&!o){if(h=="A"){if(b.j(f,"u")=="image")o=b.zg(f,"IMG");else o=b.B(f,"image",d);if(o){w=f;b.bb(w,"block");b.N(w,V);B=b.fb(w,d);b.F(w,"relative");b.Cb(B,0);b.Y(B,"backgroundColor","#000")}}else if(h=="IMG"&&b.j(f,"u")=="image")o=f;if(o){o.border=0;b.N(o,V)}}T(f,c,e+1)})}e.Oc=function(c,b){var a=u-b;ac(H,a)};e.xb=f;n.call(e);b.Eg(i,b.j(i,"p"));b.Dg(i,b.j(i,"po"));var L=b.B(i,"thumb",d);if(L){e.ze=b.fb(L);b.S(L)}b.E(i);x=b.fb(cb);b.K(x,1e3);b.g(i,"click",Z);E(d);e.fc=o;e.ud=B;e.ad=i;e.Xb=H=i;b.L(H,x);h.$On(203,S);h.$On(28,db);h.$On(24,bb)}function zc(y,f,p,q){var a=this,n=0,u=0,g,i,e,c,k,t,r,o=C[f];m.call(a,0,0);function v(){b.sc(N);ec&&k&&o.ud&&b.L(N,o.ud);b.E(N,!k&&o.fc)}function w(){a.Mc()}function x(b){r=b;a.ob();a.Mc()}a.Mc=function(){var b=a.Gb();if(!B&&!O&&!r&&s==f){if(!b){if(g&&!k){k=d;a.Tc(d);h.n(j.$EVT_SLIDESHOW_START,f,n,u,g,c)}v()}var l,p=j.$EVT_STATE_CHANGE;if(b!=c)if(b==e)l=c;else if(b==i)l=e;else if(!b)l=i;else l=a.od();h.n(p,f,b,n,i,e,c);var m=P&&(!E||F);if(b==c)(e!=c&&!(E&12)||m)&&o.re();else(m||b!=e)&&a.kd(l,w)}};a.Vd=function(){e==c&&e==a.Gb()&&a.v(i)};a.xe=function(){A&&A.xb==f&&A.Ib();var b=a.Gb();b<c&&h.n(j.$EVT_STATE_CHANGE,f,-b-1,n,i,e,c)};a.Tc=function(a){p&&b.rb(hb,a&&p.eb.$Outside?"":"hidden")};a.Oc=function(b,a){if(k&&a>=g){k=l;v();o.Od();A.Ib();h.n(j.$EVT_SLIDESHOW_END,f,n,u,g,c)}h.n(j.$EVT_PROGRESS_CHANGE,f,a,n,i,e,c)};a.Wc=function(a){if(a&&!t){t=a;a.$On($JssorPlayer$.me,x)}};p&&a.Kc(p);g=a.db();a.Kc(q);i=g+q.bc;e=g+q.lc;c=a.db()}function Lb(a,c,d){b.D(a,c);b.C(a,d)}function ac(c,b){var a=x>0?x:gb,d=Bb*b*(a&1),e=Cb*b*(a>>1&1);Lb(c,d,e)}function Qb(){pb=O;Kb=z.od();G=w.cb()}function hc(){Qb();if(B||!F&&E&12){z.ob();h.n(j.Rg)}}function fc(f){if(!B&&(F||!(E&12))&&!z.$IsPlaying()){var d=w.cb(),b=c.ceil(G);if(f&&c.abs(H)>=a.$MinDragOffsetToSlide){b=c.ceil(d);b+=eb}if(!(D&1))b=c.min(r-u,c.max(b,0));var e=c.abs(b-d);e=1-c.pow(1-e,5);if(!M&&pb)z.ie(Kb);else if(d==b){tb.Yd();tb.Nc()}else z.Ub(d,b,e*Wb)}}function Ib(a){!b.j(b.Ec(a),"nodrag")&&b.Pb(a)}function vc(a){Zb(a,1)}function Zb(a,c){a=b.zd(a);var i=b.Ec(a);if(!L&&!b.j(i,"nodrag")&&wc()&&(!c||a.touches.length==1)){B=d;Ab=l;R=k;b.g(g,c?"touchmove":"mousemove",Db);b.R();M=0;hc();if(!pb)x=0;if(c){var f=a.touches[0];vb=f.clientX;wb=f.clientY}else{var e=b.Sd(a);vb=e.x;wb=e.y}H=0;bb=0;eb=0;h.n(j.$EVT_DRAG_START,t(G),G,a)}}function Db(e){if(B){e=b.zd(e);var f;if(e.type!="mousemove"){var l=e.touches[0];f={x:l.clientX,y:l.clientY}}else f=b.Sd(e);if(f){var j=f.x-vb,k=f.y-wb;if(c.floor(G)!=G)x=x||gb&L;if((j||k)&&!x){if(L==3)if(c.abs(k)>c.abs(j))x=2;else x=1;else x=L;if(jb&&x==1&&c.abs(k)-c.abs(j)>3)Ab=d}if(x){var a=k,i=Cb;if(x==1){a=j;i=Bb}if(!(D&1)){if(a>0){var g=i*s,h=a-g;if(h>0)a=g+c.sqrt(h)*5}if(a<0){var g=i*(r-u-s),h=-a-g;if(h>0)a=-g-c.sqrt(h)*5}}if(H-bb<-2)eb=0;else if(H-bb>2)eb=-1;bb=H;H=a;sb=G-H/i/(Z||1);if(H&&x&&!Ab){b.Pb(e);if(!O)z.ue(sb);else z.te(sb)}}}}}function mb(){tc();if(B){B=l;b.R();b.Q(g,"mousemove",Db);b.Q(g,"touchmove",Db);M=H;z.ob();var a=w.cb();h.n(j.$EVT_DRAG_END,t(a),a,t(G),G);E&12&&Qb();fc(d)}}function lc(c){if(M){b.yg(c);var a=b.Ec(c);while(a&&v!==a){a.tagName=="A"&&b.Pb(c);try{a=a.parentNode}catch(d){break}}}}function pc(a){C[s];s=t(a);tb=C[s];Vb(a);return s}function Hc(a,b){x=0;pc(a);h.n(j.$EVT_PARK,t(a),b)}function Vb(a,c){yb=a;b.c(S,function(b){b.rc(t(a),a,c)})}function wc(){var b=j.td||0,a=Y;if(jb)a&1&&(a&=1);j.td|=a;return L=a&~b}function tc(){if(L){j.td&=~Y;L=0}}function Yb(){var a=b.tb();b.N(a,V);b.F(a,"absolute");return a}function t(a){return(a%r+r)%r}function mc(b,d){if(d)if(!D){b=c.min(c.max(b+yb,0),r-u);d=l}else if(D&2){b=t(b+yb);d=l}nb(b,a.$SlideDuration,d)}function zb(){b.c(S,function(a){a.vc(a.hc.$ChanceToShow<=F)})}function jc(){if(!F){F=1;zb();if(!B){E&12&&fc();E&3&&C[s].Nc()}}}function ic(){if(F){F=0;zb();B||!(E&12)||hc()}}function kc(){V={W:K,X:J,$Top:0,$Left:0};b.c(T,function(a){b.N(a,V);b.F(a,"absolute");b.rb(a,"hidden");b.S(a)});b.N(cb,V)}function lb(b,a){nb(b,a,d)}function nb(h,g,k){if(Sb&&(!B&&(F||!(E&12))||a.$NaviQuitDrag)){O=d;B=l;z.ob();if(g==f)g=Wb;var e=Eb.Gb(),b=h;if(k){b=e+h;if(h>0)b=c.ceil(b);else b=c.floor(b)}if(D&2)b=t(b);if(!(D&1))b=c.max(0,c.min(b,r-u));var j=(b-e)%r;b=e+j;var i=e==b?0:g*c.abs(j);i=c.min(i,g*u*1.5);z.Ub(e,b,i||1)}}h.$PlayTo=nb;h.$GoTo=function(a){w.v(a)};h.$Next=function(){lb(1)};h.$Prev=function(){lb(-1)};h.$Pause=function(){P=l};h.$Play=function(){if(!P){P=d;C[s]&&C[s].Nc()}};h.$SetSlideshowTransitions=function(b){a.$SlideshowOptions.$Transitions=b};h.$SetCaptionTransitions=function(a){I.$Transitions=a;I.Rc=b.R()};h.$SlidesCount=function(){return T.length};h.$CurrentIndex=function(){return s};h.$IsAutoPlaying=function(){return P};h.$IsDragging=function(){return B};h.$IsSliding=function(){return O};h.$IsMouseOver=function(){return!F};h.$LastDragSucceded=function(){return M};function X(){return b.k(y||p)}function ib(){return b.l(y||p)}h.$OriginalWidth=h.$GetOriginalWidth=X;h.$OriginalHeight=h.$GetOriginalHeight=ib;function Gb(c,d){if(c==f)return b.k(p);if(!y){var a=b.tb(g);b.id(a,b.id(p));b.gc(a,b.gc(p));b.bb(a,"block");b.F(a,"relative");b.C(a,0);b.D(a,0);b.rb(a,"visible");y=b.tb(g);b.F(y,"absolute");b.C(y,0);b.D(y,0);b.k(y,b.k(p));b.l(y,b.l(p));b.Nd(y,"0 0");b.L(y,a);var i=b.V(p);b.L(p,y);b.Y(p,"backgroundImage","");b.c(i,function(c){b.L(b.j(c,"noscale")?p:a,c);b.j(c,"autocenter")&&Mb.push(c)})}Z=c/(d?b.l:b.k)(y);b.Cg(y,Z);var h=d?Z*X():c,e=d?c:Z*ib();b.k(p,h);b.l(p,e);b.c(Mb,function(a){var c=b.ic(b.j(a,"autocenter"));b.Pg(a,c)})}h.$ScaleHeight=h.$GetScaleHeight=function(a){if(a==f)return b.l(p);Gb(a,d)};h.$ScaleWidth=h.$SetScaleWidth=h.$GetScaleWidth=Gb;h.Dd=function(a){var d=c.ceil(t(fb/cc)),b=t(a-s+d);if(b>u){if(a-s>r/2)a-=r;else if(a-s<=-r/2)a+=r}else a=s+b-d;return a};n.call(h);h.$Elmt=p=b.mb(p);var a=b.p({$FillMode:0,$LazyLoading:1,$ArrowKeyNavigation:1,$StartIndex:0,$AutoPlay:l,$Loop:1,$HWA:d,$NaviQuitDrag:d,$AutoPlaySteps:1,$AutoPlayInterval:3e3,$PauseOnHover:1,$SlideDuration:500,$SlideEasing:e.$EaseOutQuad,$MinDragOffsetToSlide:20,$SlideSpacing:0,$Cols:1,$Align:0,$UISearchMode:1,$PlayOrientation:1,$DragOrientation:1},gc);a.$HWA=a.$HWA&&b.rg();if(a.$Idle!=f)a.$AutoPlayInterval=a.$Idle;if(a.$DisplayPieces!=f)a.$Cols=a.$DisplayPieces;if(a.$ParkingPosition!=f)a.$Align=a.$ParkingPosition;var gb=a.$PlayOrientation&3,xc=(a.$PlayOrientation&4)/-4||1,db=a.$SlideshowOptions,I=b.p({$Class:q,$PlayInMode:1,$PlayOutMode:1,$HWA:a.$HWA},a.$CaptionSliderOptions);I.$Transitions=I.$Transitions||I.$CaptionTransitions;var qb=a.$BulletNavigatorOptions,W=a.$ArrowNavigatorOptions,ab=a.$ThumbnailNavigatorOptions,Q=!a.$UISearchMode,y,v=b.B(p,"slides",Q),cb=b.B(p,"loading",Q)||b.tb(g),Jb=b.B(p,"navigator",Q),dc=b.B(p,"arrowleft",Q),bc=b.B(p,"arrowright",Q),Hb=b.B(p,"thumbnavigator",Q),oc=b.k(v),nc=b.l(v),V,T=[],yc=b.V(v);b.c(yc,function(a){if(a.tagName=="DIV"&&!b.j(a,"u"))T.push(a);else b.hb()&&b.K(a,(b.K(a)||0)+1)});var s=-1,yb,tb,r=T.length,K=a.$SlideWidth||oc,J=a.$SlideHeight||nc,Xb=a.$SlideSpacing,Bb=K+Xb,Cb=J+Xb,cc=gb&1?Bb:Cb,u=c.min(a.$Cols,r),hb,x,L,Ab,S=[],Rb,Tb,Pb,ec,Gc,P,E=a.$PauseOnHover,qc=a.$AutoPlayInterval,Wb=a.$SlideDuration,rb,ub,fb,Sb=u<r,D=Sb?a.$Loop:0,Y,M,F=1,O,B,R,vb=0,wb=0,H,bb,eb,Eb,w,U,z,Ub=new sc,Z,Mb=[];if(a.$HWA)Lb=function(a,c,d){b.yb(a,{$TranslateX:c,$TranslateY:d})};P=a.$AutoPlay;h.hc=gc;kc();b.G(p,"jssor-slider",d);b.K(v,b.K(v)||0);b.F(v,"absolute");hb=b.fb(v,d);b.dc(hb,v);if(db){ec=db.$ShowLink;rb=db.$Class;ub=u==1&&r>1&&rb&&(!b.Cd()||b.xd()>=8)}fb=ub||u>=r||!(D&1)?0:a.$Align;Y=(u>1||fb?gb:-1)&a.$DragOrientation;var xb=v,C=[],A,N,Fb=b.Sg(),jb=Fb.Wg,G,pb,Kb,sb;Fb.Ed&&b.Y(xb,Fb.Ed,([k,"pan-y","pan-x","none"])[Y]||"");U=new Dc;if(ub)A=new rb(Ub,K,J,db,jb);b.L(hb,U.Xb);b.rb(v,"hidden");N=Yb();b.Y(N,"backgroundColor","#000");b.Cb(N,0);b.dc(N,xb.firstChild,xb);for(var ob=0;ob<T.length;ob++){var Ac=T[ob],Cc=new Bc(Ac,ob);C.push(Cc)}b.S(cb);Eb=new Ec;z=new rc(Eb,U);if(Y){b.g(v,"mousedown",Zb);b.g(v,"touchstart",vc);b.g(v,"dragstart",Ib);b.g(v,"selectstart",Ib);b.g(g,"mouseup",mb);b.g(g,"touchend",mb);b.g(g,"touchcancel",mb);b.g(i,"blur",mb)}E&=jb?10:5;if(Jb&&qb){Rb=new qb.$Class(Jb,qb,X(),ib());S.push(Rb)}if(W&&dc&&bc){W.$Loop=D;W.$Cols=u;Tb=new W.$Class(dc,bc,W,X(),ib());S.push(Tb)}if(Hb&&ab){ab.$StartIndex=a.$StartIndex;Pb=new ab.$Class(Hb,ab);S.push(Pb)}b.c(S,function(a){a.Lc(r,C,cb);a.$On(o.kc,mc)});b.Y(p,"visibility","visible");Gb(X());b.g(v,"click",lc);b.g(p,"mouseout",b.Rb(jc,p));b.g(p,"mouseover",b.Rb(ic,p));zb();a.$ArrowKeyNavigation&&b.g(g,"keydown",function(b){if(b.keyCode==37)lb(-a.$ArrowKeyNavigation);else b.keyCode==39&&lb(a.$ArrowKeyNavigation)});var kb=a.$StartIndex;if(!(D&1))kb=c.max(0,c.min(kb,r-u));z.Ub(kb,kb,0)};j.$EVT_CLICK=21;j.$EVT_DRAG_START=22;j.$EVT_DRAG_END=23;j.$EVT_SWIPE_START=24;j.$EVT_SWIPE_END=25;j.$EVT_LOAD_START=26;j.$EVT_LOAD_END=27;j.Rg=28;j.$EVT_POSITION_CHANGE=202;j.$EVT_PARK=203;j.$EVT_SLIDESHOW_START=206;j.$EVT_SLIDESHOW_END=207;j.$EVT_PROGRESS_CHANGE=208;j.$EVT_STATE_CHANGE=209;var o={kc:1};i.$JssorBulletNavigator$=function(e,C){var f=this;n.call(f);e=b.mb(e);var s,A,z,r,j=0,a,m,i,w,x,h,g,q,p,B=[],y=[];function v(a){a!=-1&&y[a].qd(a==j)}function t(a){f.n(o.kc,a*m)}f.$Elmt=e;f.rc=function(a){if(a!=r){var d=j,b=c.floor(a/m);j=b;r=a;v(d);v(b)}};f.vc=function(a){b.E(e,a)};var u;f.Lc=function(E){if(!u){s=c.ceil(E/m);j=0;var o=q+w,r=p+x,n=c.ceil(s/i)-1;A=q+o*(!h?n:i-1);z=p+r*(h?n:i-1);b.k(e,A);b.l(e,z);for(var f=0;f<s;f++){var C=b.Hg();b.xg(C,f+1);var l=b.Zc(g,"numbertemplate",C,d);b.F(l,"absolute");var v=f%(n+1);b.D(l,!h?o*v:f%i*o);b.C(l,h?r*v:c.floor(f/(n+1))*r);b.L(e,l);B[f]=l;a.$ActionMode&1&&b.g(l,"click",b.H(k,t,f));a.$ActionMode&2&&b.g(l,"mouseover",b.Rb(b.H(k,t,f),l));y[f]=b.ec(l)}u=d}};f.hc=a=b.p({$SpacingX:10,$SpacingY:10,$Orientation:1,$ActionMode:1},C);g=b.B(e,"prototype");q=b.k(g);p=b.l(g);b.Kb(g,e);m=a.$Steps||1;i=a.$Lanes||1;w=a.$SpacingX;x=a.$SpacingY;h=a.$Orientation-1;a.$Scale==l&&b.G(e,"noscale",d);a.$AutoCenter&&b.G(e,"autocenter",a.$AutoCenter)};i.$JssorArrowNavigator$=function(a,g,h){var c=this;n.call(c);var r,q,e,f,i;b.k(a);b.l(a);function j(a){c.n(o.kc,a,d)}function p(c){b.E(a,c||!h.$Loop&&e==0);b.E(g,c||!h.$Loop&&e>=q-h.$Cols);r=c}c.rc=function(b,a,c){if(c)e=a;else{e=b;p(r)}};c.vc=p;var m;c.Lc=function(c){q=c;e=0;if(!m){b.g(a,"click",b.H(k,j,-i));b.g(g,"click",b.H(k,j,i));b.ec(a);b.ec(g);m=d}};c.hc=f=b.p({$Steps:1},h);i=f.$Steps;if(f.$Scale==l){b.G(a,"noscale",d);b.G(g,"noscale",d)}if(f.$AutoCenter){b.G(a,"autocenter",f.$AutoCenter);b.G(g,"autocenter",f.$AutoCenter)}};i.$JssorThumbnailNavigator$=function(h,C){var i=this,z,q,a,w=[],A,y,e,r,s,v,u,p,t,g,m;n.call(i);h=b.mb(h);function B(n,f){var g=this,c,l,j;function p(){l.qd(q==f)}function h(d){if(d||!t.$LastDragSucceded()){var a=e-f%e,b=t.Dd((f+a)/e-1),c=b*e+e-a;i.n(o.kc,c)}}g.xb=f;g.Xc=p;j=n.ze||n.fc||b.tb();g.Xb=c=b.Zc(m,"thumbnailtemplate",j,d);l=b.ec(c);a.$ActionMode&1&&b.g(c,"click",b.H(k,h,0));a.$ActionMode&2&&b.g(c,"mouseover",b.Rb(b.H(k,h,1),c))}i.rc=function(b,d,f){var a=q;q=b;a!=-1&&w[a].Xc();w[b].Xc();!f&&t.$PlayTo(t.Dd(c.floor(d/e)))};i.vc=function(a){b.E(h,a)};var x;i.Lc=function(F,C){if(!x){z=F;c.ceil(z/e);q=-1;p=c.min(p,C.length);var f=a.$Orientation&1,m=v+(v+r)*(e-1)*(1-f),k=u+(u+s)*(e-1)*f,o=m+(m+r)*(p-1)*f,n=k+(k+s)*(p-1)*(1-f);b.F(g,"absolute");b.rb(g,"hidden");a.$AutoCenter&1&&b.D(g,(A-o)/2);a.$AutoCenter&2&&b.C(g,(y-n)/2);b.k(g,o);b.l(g,n);var i=[];b.c(C,function(l,h){var j=new B(l,h),d=j.Xb,a=c.floor(h/e),k=h%e;b.D(d,(v+r)*k*(1-f));b.C(d,(u+s)*k*f);if(!i[a]){i[a]=b.tb();b.L(g,i[a])}b.L(i[a],d);w.push(j)});var E=b.p({$AutoPlay:l,$NaviQuitDrag:l,$SlideWidth:m,$SlideHeight:k,$SlideSpacing:r*f+s*(1-f),$MinDragOffsetToSlide:12,$SlideDuration:200,$PauseOnHover:1,$PlayOrientation:a.$Orientation,$DragOrientation:a.$NoDrag||a.$DisableDrag?0:a.$Orientation},a);t=new j(h,E);x=d}};i.hc=a=b.p({$SpacingX:0,$SpacingY:0,$Cols:1,$Orientation:1,$AutoCenter:3,$ActionMode:1},C);if(a.$DisplayPieces!=f)a.$Cols=a.$DisplayPieces;if(a.$Rows!=f)a.$Lanes=a.$Rows;A=b.k(h);y=b.l(h);g=b.B(h,"slides",d);m=b.B(g,"prototype");v=b.k(m);u=b.l(m);b.Kb(m,g);e=a.$Lanes||1;r=a.$SpacingX;s=a.$SpacingY;p=a.$Cols;a.$Scale==l&&b.G(h,"noscale",d)};function q(e,d,c){var a=this;m.call(a,0,c);a.wb=b.ld;a.bc=0;a.lc=c}i.$JssorCaptionSlider$=function(i,g,j){var a=this;m.call(a,0,0);var e,d;function h(p,i,g){var a=this,h,n=g?i.$PlayInMode:i.$PlayOutMode,e=i.$Transitions,o={eb:"t",$Delay:"d",$Duration:"du",x:"x",y:"y",$Rotate:"r",$Zoom:"z",$Opacity:"f",Jb:"b"},d={qb:function(b,a){if(!isNaN(a.vb))b=a.vb;else b*=a.Nf;return b},$Opacity:function(b,a){return this.qb(b-1,a)}};d.$Zoom=d.$Opacity;m.call(a,0,0);function k(r,m){var l=[],i,j=[],a=[];function h(c,d){var a={};b.c(o,function(g,h){var e=b.j(c,g+(d||""));if(e){var f={};if(g=="t")f.vb=e;else if(e.indexOf("%")+1)f.Nf=b.qc(e)/100;else f.vb=b.qc(e);a[h]=f}});return a}function p(){return e[c.floor(c.random()*e.length)]}function f(g){var h;if(g=="*")h=p();else if(g){var d=e[b.ic(g)]||e[g];if(b.xc(d)){if(g!=i){i=g;a[g]=0;j[g]=d[c.floor(c.random()*d.length)]}else a[g]++;d=j[g];if(b.xc(d)){d=d.length&&d[a[g]%d.length];if(b.xc(d))d=d[c.floor(c.random()*d.length)]}}h=d;if(b.yd(h))h=f(h)}return h}var q=b.V(r);b.c(q,function(a){var c=[];c.$Elmt=a;var e=b.j(a,"u")=="caption";b.c(g?[0,3]:[2],function(l,o){if(e){var j,g;if(l!=2||!b.j(a,"t3")){g=h(a,l);if(l==2&&!g.eb){g.$Delay=g.$Delay||{vb:0};g=b.p(h(a,0),g)}}if(g&&g.eb){j=f(g.eb.vb);if(j){var i=b.p({$Delay:0},j);b.c(g,function(c,a){var b=(d[a]||d.qb).apply(d,[i[a],g[a]]);if(!isNaN(b))i[a]=b});if(!o)if(g.Jb)i.Jb=g.Jb.vb||0;else if(n&2)i.Jb=0}}c.push(i)}if(m%2&&!o)c.V=k(a,m+1)});l.push(c)});return l}function l(w,a,z){var k={$Easing:a.$Easing,$Round:a.$Round,$During:a.$During,$Reverse:g&&!z},l=w,r=b.Dc(w),j=b.k(l),i=b.l(l),y=b.k(r),x=b.l(r),f={},e={},h=a.$ScaleClip||1;if(a.$Opacity)e.$Opacity=1-a.$Opacity;k.$OriginalWidth=j;k.$OriginalHeight=i;if(a.$Zoom||a.$Rotate){e.$Zoom=(a.$Zoom||2)-2;if(b.hb()||b.Bc())e.$Zoom=c.min(e.$Zoom,1);f.$Zoom=1;var B=a.$Rotate||0;e.$Rotate=B*360;f.$Rotate=0}else if(a.$Clip){var s={$Top:0,$Right:j,$Bottom:i,$Left:0},v=b.p({},s),d=v.Ob={},u=a.$Clip&4,p=a.$Clip&8,t=a.$Clip&1,q=a.$Clip&2;if(u&&p){d.$Top=i/2*h;d.$Bottom=-d.$Top}else if(u)d.$Bottom=-i*h;else if(p)d.$Top=i*h;if(t&&q){d.$Left=j/2*h;d.$Right=-d.$Left}else if(t)d.$Right=-j*h;else if(q)d.$Left=j*h;k.$Move=a.$Move;e.$Clip=v;f.$Clip=s}var n=0,o=0;if(a.x)n-=y*a.x;if(a.y)o-=x*a.y;if(n||o||k.$Move){e.$Left=n;e.$Top=o}var A=a.$Duration;f=b.p(f,b.Re(l,e));return new m(a.$Delay,A,k,l,f,e)}function j(c,d){b.c(d,function(d){var b,i=d.$Elmt,e=d[0],k=d[1];if(e){b=l(i,e);e.Jb==f&&b.$Shift(c);c=b.db()}c=j(c,d.V);if(k){var g=l(i,k,1);g.$Shift(c);a.I(g);h.I(g)}b&&a.I(b)});return c}a.wb=function(){a.v(a.db()*(g||0));h.v(0)};h=new m(0,0);j(0,n?k(p,1):[])}a.wb=function(){d.wb();e.wb()};e=new h(i,g,1);a.bc=e.db();a.lc=a.bc+j;d=new h(i,g);d.$Shift(a.lc);a.I(d);a.I(e)};i.$JssorCaptionSlideo$=function(n,f,l){var a=this,o,g={},i=f.$Transitions,c=new m(0,0);m.call(a,0,0);function j(d,c){var a={};b.c(d,function(d,f){var e=g[f];if(e){if(b.Gg(d))d=j(d,c||f=="e");else if(c)if(b.cc(d))d=o[d];a[e]=d}});return a}function k(e,c){var a=[],d=b.V(e);b.c(d,function(d){var h=b.j(d,"u")=="caption";if(h){var e=b.j(d,"t"),g=i[b.ic(e)]||i[e],f={$Elmt:d,eb:g};a.push(f)}if(c<5)a=a.concat(k(d,c+1))});return a}function r(d,e,a){b.c(e,function(g){var e=j(g),f=b.Ac(e.$Easing);if(e.$Left){e.Db=e.$Left;f.Db=f.$Left;delete e.$Left}if(e.$Top){e.Bb=e.$Top;f.Bb=f.$Top;delete e.$Top}var h={$Easing:f,$OriginalWidth:a.W,$OriginalHeight:a.X},i=new m(g.b,g.d,h,d,a,e);c.I(i);a=b.we(a,e)});return a}function q(a){b.c(a,function(f){var a=f.$Elmt,e=b.k(a),d=b.l(a),c={$Left:b.D(a),$Top:b.C(a),Db:0,Bb:0,$Opacity:1,$ZIndex:b.K(a)||0,$Rotate:0,$RotateX:0,$RotateY:0,$ScaleX:1,$ScaleY:1,$TranslateX:0,$TranslateY:0,$TranslateZ:0,$SkewX:0,$SkewY:0,W:e,X:d,$Clip:{$Top:0,$Right:e,$Bottom:d,$Left:0}};c.Qd=c.$Left;c.Td=c.$Top;r(a,f.eb,c)})}function t(g,f,h){var e=g.b-f;if(e){var b=new m(f,e);b.I(c,d);b.$Shift(h);a.I(b)}a.ee(g.d);return e}function s(f){var d=c.Jc(),e=0;b.c(f,function(c,f){c=b.p({d:l},c);t(c,d,e);d=c.b;e+=c.d;if(!f||c.t==2){a.bc=d;a.lc=d+c.d}})}a.wb=function(){a.v(-1,d)};o=[h.$Swing,h.$Linear,h.$InQuad,h.$OutQuad,h.$InOutQuad,h.$InCubic,h.$OutCubic,h.$InOutCubic,h.$InQuart,h.$OutQuart,h.$InOutQuart,h.$InQuint,h.$OutQuint,h.$InOutQuint,h.$InSine,h.$OutSine,h.$InOutSine,h.$InExpo,h.$OutExpo,h.$InOutExpo,h.$InCirc,h.$OutCirc,h.$InOutCirc,h.$InElastic,h.$OutElastic,h.$InOutElastic,h.$InBack,h.$OutBack,h.$InOutBack,h.$InBounce,h.$OutBounce,h.$InOutBounce,h.$GoBack,h.$InWave,h.$OutWave,h.$OutJump,h.$InJump];var u={$Top:"y",$Left:"x",$Bottom:"m",$Right:"t",$Rotate:"r",$RotateX:"rX",$RotateY:"rY",$ScaleX:"sX",$ScaleY:"sY",$TranslateX:"tX",$TranslateY:"tY",$TranslateZ:"tZ",$SkewX:"kX",$SkewY:"kY",$Opacity:"o",$Easing:"e",$ZIndex:"i",$Clip:"c"};b.c(u,function(b,a){g[b]=a});q(k(n,1));c.v(-1);var p=f.$Breaks||[],e=[].concat(p[b.ic(b.j(n,"b"))]||[]);e.push({b:c.db(),d:e.length?0:l});s(e);a.v(-1)}})(window,document,Math,null,true,false)
 jQuery(document).ready(function ($) {

            var jssor_1_SlideoTransitions = [
              [{ b: 5500.0, d: 3000.0, o: -1.0, r: 240.0, e: { r: 2.0 } }],
              [{ b: -1.0, d: 1.0, o: -1.0, c: { x: 51.0, t: -51.0 } }, { b: 0.0, d: 1000.0, o: 1.0, c: { x: -51.0, t: 51.0 }, e: { o: 7.0, c: { x: 7.0, t: 7.0 } } }],
              [{ b: -1.0, d: 1.0, o: -1.0, sX: 9.0, sY: 9.0 }, { b: 1000.0, d: 1000.0, o: 1.0, sX: -9.0, sY: -9.0, e: { sX: 2.0, sY: 2.0 } }],
              [{ b: -1.0, d: 1.0, o: -1.0, r: -180.0, sX: 9.0, sY: 9.0 }, { b: 2000.0, d: 1000.0, o: 1.0, r: 180.0, sX: -9.0, sY: -9.0, e: { r: 2.0, sX: 2.0, sY: 2.0 } }],
              [{ b: -1.0, d: 1.0, o: -1.0 }, { b: 3000.0, d: 2000.0, y: 180.0, o: 1.0, e: { y: 16.0 } }],
              [{ b: -1.0, d: 1.0, o: -1.0, r: -150.0 }, { b: 7500.0, d: 1600.0, o: 1.0, r: 150.0, e: { r: 3.0 } }],
              [{ b: 10000.0, d: 2000.0, x: -379.0, e: { x: 7.0 } }],
              [{ b: 10000.0, d: 2000.0, x: -379.0, e: { x: 7.0 } }],
              [{ b: -1.0, d: 1.0, o: -1.0, r: 288.0, sX: 9.0, sY: 9.0 }, { b: 9100.0, d: 900.0, x: -1400.0, y: -660.0, o: 1.0, r: -288.0, sX: -9.0, sY: -9.0, e: { r: 6.0 } }, { b: 10000.0, d: 1600.0, x: -200.0, o: -1.0, e: { x: 16.0 } }]
            ];

            var jssor_1_options = {
                $AutoPlay: true,
                $SlideDuration: 800,
                $SlideEasing: $Jease$.$OutQuint,
                $CaptionSliderOptions: {
                    $Class: $JssorCaptionSlideo$,
                    $Transitions: jssor_1_SlideoTransitions
                },
                $ArrowNavigatorOptions: {
                    $Class: $JssorArrowNavigator$
                },
                $BulletNavigatorOptions: {
                    $Class: $JssorBulletNavigator$
                }
            };

            var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

            //responsive code begin
            //you can remove responsive code if you don't want the slider scales while window resizing
            function ScaleSlider() {
                var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
                if (refSize) {
                    refSize = Math.min(refSize, 1920);
                    jssor_1_slider.$ScaleWidth(refSize);
                }
                else {
                    window.setTimeout(ScaleSlider, 30);
                }
            }
            ScaleSlider();
            $(window).bind("load", ScaleSlider);
            $(window).bind("resize", ScaleSlider);
            $(window).bind("orientationchange", ScaleSlider);
            //responsive code end
        });