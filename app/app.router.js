demo.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/pageIndex");
    $stateProvider.state('pageIndex', {
            url: '/pageIndex',
            templateUrl: 'common/templete/pageIndex.html'
        })
        .state('pageIndex.page1', {
            url: '/page1',
            templateUrl: 'page1/page1.html',
            controller: 'page1Ctrl'
        }).state('pageIndex.page2', {
            url: '/page2',
            templateUrl: 'page2/page2.html',
            controller: 'page2Ctrl'
        });
})