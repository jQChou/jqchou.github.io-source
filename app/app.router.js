angular.module('blog').config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/main/home");
    $stateProvider.state('main', {
        url: '/main',
        templateUrl: 'common/templete/main.html',
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    '/common/directives/nav.min.js'
                ]);
            }
        }
    }).state('main.home', {
        url: '/home',
        templateUrl: 'home/home.html'
    }).state('main.page1', {
        url: '/page1',
        templateUrl: 'page1/page1.html',
        controller: 'page1Ctrl',
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    '/page1/controllers/page1Ctrl.min.js'
                ]);
            }
        }
    }).state('main.page2', {
        url: '/page2',
        templateUrl: 'page2/page2.html',
        controller: 'page2Ctrl',
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    '/page2/controllers/page2Ctrl.min.js'
                ]);
            }
        }
    });
})