module Transit {
    'use strict';

    export var App = angular.module('MyApp', ['ngResource', 'ngRoute']);

    App.config([
        '$routeProvider',
        ($routeProvider: ng.route.IRouteProvider)=> {
            $routeProvider
                .when('/home', {
                    controller: Transit.Controllers.HomeCtrl,
                    templateUrl: '/app/partials/home.html'
                })
                .otherwise({
                    redirectTo: '/home'
                });
        }
    ]);
}