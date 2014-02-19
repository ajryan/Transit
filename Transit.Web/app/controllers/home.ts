module Transit.Controllers {
    'use strict';

    export interface HomeScope extends ng.IScope {
        agencies: string[];
        agency: string;
        zip: number;
        stations: string[];
        markers: any;
        tiles: any;
        center: any;
        go(): void;
    }

    export class HomeCtrl {
        static $inject = ['$scope', 'agencyService', 'bartService'];

        constructor(private $scope: HomeScope, private agencyService: Transit.Services.AgencyService,
            private bartService: Transit.Services.BartService)
        {
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
                navigator.geolocation.getCurrentPosition(position=> {
                    console.log(position);
                    $scope.$apply(() => {
                        $scope.center = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            zoom: 15
                        };
                    });
                });
            }

            $scope.agencies = agencyService.getAvailableAgencies();

            $scope.go = () => {
                // TODO: agency registry
                if ($scope.agency != 'BART') return;

                bartService.getStations().then(stations => {
                    $scope.stations = stations.map((s: Transit.Services.IStation) => {
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
    }
}