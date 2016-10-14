angular.module('blog').controller('page1Ctrl', function ($scope, $http) {
    $http({
        method: 'GET',
        url: '/common/article.json'
    }).then(function successCallback(response) {
        $scope.list = response.data;
        $scope.article = $scope.list[1];
    }, function errorCallback(response) {
        console.warn('can\'t get this article data');
    });
    $scope.articleChange = function (list) {
        $scope.article = list;
    }
})