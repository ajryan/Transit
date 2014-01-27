var Transit;
(function (Transit) {
    'use strict';

    Transit.App = angular.module('MyApp', ['ngResource', 'ngRoute']);

    Transit.App.config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/home', {
                controller: Transit.Controllers.HomeCtrl,
                templateUrl: '/app/partials/home.html'
            }).otherwise({
                redirectTo: '/home'
            });
        }
    ]);
})(Transit || (Transit = {}));
//# sourceMappingURL=app.js.map
