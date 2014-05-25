var Transit;
(function (Transit) {
    (function (Controllers) {
        'use strict';

        var HomeCtrl = (function () {
            function HomeCtrl($scope, $http, $interpolate, leafletData, agencyService, bartService) {
                this.$scope = $scope;
                this.$http = $http;
                this.$interpolate = $interpolate;
                this.leafletData = leafletData;
                this.agencyService = agencyService;
                this.bartService = bartService;
                $scope.showAllStations = false;
                $scope.menuShown = true;
                $scope.mapStyle = { left: '17em' };
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
                $scope.$on('leafletDirectiveMarker.popupopen', function (event) {
                    var args = [];
                    for (var _i = 0; _i < (arguments.length - 1); _i++) {
                        args[_i] = arguments[_i + 1];
                    }
                    console.log(event, args);
                    $scope.stations.some(function (station) {
                        if (station.abbrev == args[0].markerName) {
                            $scope.selectedStation = station;
                            return true;
                        }
                        return false;
                    });

                    bartService.getDepartures(args[0].markerName).then(function (departures) {
                        console.log(departures);
                        $scope.selectedDepartures = departures;
                    });
                });

                $scope.$on('leafletDirectiveMap.moveend', function (event) {
                    var args = [];
                    for (var _i = 0; _i < (arguments.length - 1); _i++) {
                        args[_i] = arguments[_i + 1];
                    }
                    console.log(event, args);
                    leafletData.getMap().then(function (map) {
                        var bounds = map.getBounds();
                        for (var stationName in $scope.stations) {
                            if ($scope.stations.hasOwnProperty(stationName)) {
                                var station = $scope.stations[stationName];
                                station.visible = bounds.contains(L.latLng(station.lat, station.lng));
                            }
                        }
                        ;
                    });
                });

                $scope.go = function () {
                    // TODO: agency registry
                    if ($scope.agency != 'BART')
                        return;

                    bartService.getStations().then(function (stations) {
                        $scope.stations = stations;
                        stations.forEach(function (s) {
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

                $scope.recenter = function () {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            console.log(position);
                            $scope.$apply(function () {
                                $scope.center = {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                    zoom: 14
                                };
                            });
                            $http.get('http://api.geonames.org/findNearbyPostalCodesJSON?username=ajryan&lat=' + position.coords.latitude + '&lng=' + position.coords.longitude).then(function (result) {
                                $scope.zip = result.data.postalCodes[0].postalCode;
                                $scope.go();
                            });
                        });
                    }
                };

                $scope.selectStation = function (station) {
                    $scope.selectedStation = station;
                    if ($scope.selectedMarker) {
                        $scope.selectedMarker.focus = false;
                    }
                    var targetMarker = $scope.markers[station.abbrev];
                    targetMarker.focus = true;
                    $scope.selectedMarker = targetMarker;
                };

                $scope.hideMenu = function () {
                    $scope.menuShown = false;
                    $scope.mapStyle = { left: '0' };
                };

                $scope.showMenu = function () {
                    $scope.menuShown = true;
                    $scope.mapStyle = { left: '17em' };
                };

                $scope.recenter();
            }
            HomeCtrl.$inject = ['$scope', '$http', '$interpolate', 'leafletData', 'agencyService', 'bartService'];
            return HomeCtrl;
        })();
        Controllers.HomeCtrl = HomeCtrl;
    })(Transit.Controllers || (Transit.Controllers = {}));
    var Controllers = Transit.Controllers;
})(Transit || (Transit = {}));
//# sourceMappingURL=home.js.map
