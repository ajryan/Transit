module Transit.Controllers {
    'use strict';
    export interface IHomeScope extends ng.IScope {
        agencies: string[];
        agency: string;
        zip: number;
        stations: Transit.Web.Models.IStation[];
        markers: any;
        tiles: any;
        center: any;
        showAllStations: boolean;
        selectedStation: Transit.Web.Models.IStation;
        selectedMarker: any;
        selectedDepartures: Transit.Web.Models.IDeparture[];
        menuShown: boolean;
        mapStyle: any;
        go(): void;
        recenter(): void;
        selectStation(station): void;
        hideMenu(): void;
        showMenu(): void;
    }

    export class HomeCtrl {
        static $inject = ['$scope', '$http', '$interpolate', 'leafletData', 'agencyService', 'bartService'];

        constructor(
            private $scope: IHomeScope,
            private $http: ng.IHttpService,
            private $interpolate: ng.IInterpolateService,
            private leafletData: any,
            private agencyService: Transit.Services.AgencyService,
            private bartService: Transit.Services.BartService
            ) {
            $scope.showAllStations = false;
            $scope.menuShown = true;
            $scope.mapStyle = {left: '17em'};
            $scope.tiles = {
                url: "http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg",
                options: {
                    attribution: "Powered by ThunderForest"
                }
            };
            $scope.center = {
                lat: 37.75, lng: -122.25, zoom: 14
            };
            $scope.markers = {};

            $scope.agencies = agencyService.getAvailableAgencies();
            $scope.agency = $scope.agencies[0];
            $scope.$on('leafletDirectiveMarker.popupopen', (event: ng.IAngularEvent, ...args: any[]) => {
                console.log(event, args);
                $scope.stations.some(station => {
                    if (station.abbrev == args[0].markerName) {
                        $scope.selectedStation = station;
                        return true;
                    }
                    return false;
                });
                
                bartService.getDepartures(args[0].markerName).then((departures: Transit.Web.Models.IDeparture[]) => {
                    console.log(departures);
                    $scope.selectedDepartures = departures;
                });
            });

            $scope.$on('leafletDirectiveMap.moveend', (event: ng.IAngularEvent, ...args: any[]) => {
                console.log(event, args);
                leafletData.getMap().then(map => {
                    var bounds = map.getBounds();
                    for (var stationName in $scope.stations) {
                        if ($scope.stations.hasOwnProperty(stationName)) {
                            var station = $scope.stations[stationName];
                            station.visible = bounds.contains(L.latLng(station.lat, station.lng));
                        }
                    };
                });
            });

            $scope.go = () => {
                // TODO: agency registry
                if ($scope.agency != 'BART') return;

                bartService.getStations().then(stations => {
                    $scope.stations = stations;
                    stations.forEach((s: Transit.Web.Models.IStation) => {
                        $scope.markers[s.abbrev] = {
                            lat: s.lat,
                            lng: s.lng,
                            message: s.name,
                            title: s.name,
                            autoPanPadding: L.point(250, 200)
                        };
                    });
                    $scope.$emit('leafletDirectiveMap.moveend');
                });
            };

            $scope.recenter = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position: Position) => {
                        console.log(position);
                        $scope.$apply(() => {
                            $scope.center = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                                zoom: 14
                            };
                        });
                        $http.get('http://api.geonames.org/findNearbyPostalCodesJSON?username=ajryan&lat=' + position.coords.latitude + '&lng=' + position.coords.longitude).then(result => {
                            $scope.zip = result.data.postalCodes[0].postalCode;
                            $scope.go();
                        });
                    });
                }
            };

            $scope.selectStation = (station) => {
                $scope.selectedStation = station;
                if ($scope.selectedMarker) {
                    $scope.selectedMarker.focus = false;
                }
                var targetMarker = $scope.markers[station.abbrev];
                targetMarker.focus = true;
                $scope.selectedMarker = targetMarker;
            };

            $scope.hideMenu = () => {
                $scope.menuShown = false;
                $scope.mapStyle = { left: '0' };
            }

            $scope.showMenu = () => {
                $scope.menuShown = true;
                $scope.mapStyle = { left: '17em' };
            }

            $scope.recenter();
        }
    }
}