var Transit;
(function (Transit) {
    (function (Services) {
        'use strict';

        

        var BartService = (function () {
            function BartService($q, $http) {
                var _this = this;
                this.$q = $q;
                this.$http = $http;
                this._xmlJsTransform = {
                    transformResponse: function (data) {
                        var json = _this._x2js.xml_str2json(data);
                        return json;
                    }
                };
                this._x2js = new X2JS();
                this._stations = null;
            }
            BartService.prototype.getStations = function () {
                var _this = this;
                var deferred = this.$q.defer();

                if (this._stations !== null) {
                    deferred.resolve(this._stations);
                    return deferred.promise;
                }

                this.$http.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V', this._xmlJsTransform).success(function (data) {
                    var stations = data.root.stations.station.map(function (s) {
                        var station = {
                            name: s.name,
                            abbrev: s.abbr,
                            lat: parseFloat(s.gtfs_latitude),
                            lng: parseFloat(s.gtfs_longitude),
                            address: [s.address, s.city, s.state, s.zipcode].join(' '),
                            visible: true
                        };
                        return station;
                    });
                    _this._stations = stations;
                    deferred.resolve(stations);
                }).error(function () {
                    deferred.reject('Error calling BART API.');
                });

                return deferred.promise;
            };

            BartService.prototype.getDepartures = function (origin) {
                var deferred = this.$q.defer();

                this.$http.get('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + origin + '&key=MW9S-E7SL-26DU-VV8V', this._xmlJsTransform).success(function (data) {
                    if (!data.root.station.hasOwnProperty('etd')) {
                        deferred.resolve([]);
                    }
                    var departures = [];

                    // normalize to array in single etd case
                    if (data.root.station.etd.hasOwnProperty('estimate')) {
                        var singleEtd = data.root.station.etd;
                        data.root.station.etd = [singleEtd];
                    }
                    data.root.station.etd.forEach(function (etd) {
                        // normalize to array in single departure case
                        if (etd.estimate.hasOwnProperty('direction')) {
                            var singleEstimate = etd.estimate;
                            etd.estimate = [singleEstimate];
                        }
                        var departure = {
                            destination: etd.destination,
                            times: etd.estimate.map(function (estimate) {
                                return {
                                    minutes: estimate.minutes == 'Leaving' ? 0 : estimate.minutes,
                                    info: 'Platform: ' + estimate.platform + '; Cars: ' + estimate.length
                                };
                            })
                        };
                        departures.push(departure);
                    });
                    deferred.resolve(departures);
                }).error(function () {
                    deferred.reject('Error calling BART API.');
                });

                return deferred.promise;
            };
            BartService.$inject = ['$q', '$http'];
            return BartService;
        })();
        Services.BartService = BartService;

        Transit.App.service('bartService', BartService);
    })(Transit.Services || (Transit.Services = {}));
    var Services = Transit.Services;
})(Transit || (Transit = {}));
//# sourceMappingURL=bart.js.map
