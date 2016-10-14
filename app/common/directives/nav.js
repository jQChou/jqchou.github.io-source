angular.module('blog').directive('activeCtrl', function ($timeout) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs, ctrl) {
            element.on('click', function () {
                $('.active-ctrl').removeClass('active');
                !$('active')[0] && element.addClass('active');
            })
        }
    }
});