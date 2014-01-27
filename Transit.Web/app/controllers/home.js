var Transit;
(function (Transit) {
    (function (Controllers) {
        'use strict';

        var HomeCtrl = (function () {
            function HomeCtrl($scope, agencyService, bartService) {
                this.$scope = $scope;
                this.agencyService = agencyService;
                this.bartService = bartService;
                $scope.agencies = agencyService.getAvailableAgencies();

                $scope.go = function () {
                    // TODO: agency registry
                    if ($scope.agency != 'BART')
                        return;

                    bartService.getStations().then(function (stations) {
                        $scope.stations = stations.map(function (s) {
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
