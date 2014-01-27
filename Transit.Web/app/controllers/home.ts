module Transit.Controllers {
    'use strict';

    export interface HomeScope extends ng.IScope {
        agencies: string[];
        agency: string;
        zip: number;
        stations: string[];

        go(): void;
    }

    export class HomeCtrl {
        static $inject = ['$scope', 'agencyService', 'bartService'];

        constructor(private $scope: HomeScope, private agencyService: Transit.Services.AgencyService,
                    private bartService: Transit.Services.BartService) {
            $scope.agencies = agencyService.getAvailableAgencies();

            $scope.go = () => {
                // TODO: agency registry
                if ($scope.agency != 'BART') return;

                bartService.getStations().then(stations => {
                    $scope.stations = stations.map(s => s.name);
                });
            };
        }
    }
}