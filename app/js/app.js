var app = angular.module("myapp", ['ngRoute', 'ngStorage', 'angularUtils.directives.dirPagination', 'ngStorage'])

app.config(function ($routeProvider) {
    // ===================================== ROUTING =====================================
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/home/home.html',
            controller: 'homeController'
        })
        .otherwise({
            redirectTo: '/'
        });

});



