var Transit;
(function (Transit) {
    (function (Controllers) {
        'use strict';

        var HomeCtrl = (function () {
            function HomeCtrl($scope, agencyService, bartService) {
                this.$scope = $scope;
                this.agencyService = agencyService;
                this.bartService = bartService;
                $scope.tiles = {
                    url: "http://{s}.tile.cloudmade.com/1d7eaa8e229240b9a24a24606aa41300/997/256/{z}/{x}/{y}.png",
                    options: {
                        attribution: "Powered by CloudMade"
                    }
                };
                $scope.center = {
                    lat: 37, lng: 37, zoom: 15
                };
                $scope.markers = {};

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        console.log(position);
                        $scope.$apply(function () {
                            $scope.center = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                                zoom: 15
                            };
                        });
                    });
                }

                $scope.agencies = agencyService.getAvailableAgencies();

                $scope.go = function () {
                    // TODO: agency registry
                    if ($scope.agency != 'BART')
                        return;

                    bartService.getStations().then(function (stations) {
                        $scope.stations = stations.map(function (s) {
                            $scope.markers[s.abbrev] = {
                                lat: s.lat,
                                lng: s.lng,
                                message: s.name
                            };
                            return s.name;
                        });
                    });
                };
            }
            HomeCtrl.$inject = ['$scope', 'agencyService', 'bartService'];
            return HomeCtrl;
        })();
        Controllers.HomeCtrl = HomeCtrl;
    })(Transit.Controllers || (Transit.Controllers = {}));
    var Controllers = Transit.Controllers;
})(Transit || (Transit = {}));
//# sourceMappingURL=home.js.map
