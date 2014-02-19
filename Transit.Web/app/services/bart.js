var Transit;
(function (Transit) {
    (function (Services) {
        'use strict';

        

        var BartService = (function () {
            function BartService($q, $http) {
                this.$q = $q;
                this.$http = $http;
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

                this.$http.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V', {
                    transformResponse: function (data) {
                        var json = _this._x2js.xml_str2json(data);
                        return json;
                    }
                }).success(function (data) {
                    var stations = data.root.stations.station.map(function (s) {
                        var station = {
                            name: s.name,
                            abbrev: s.abbr,
                            lat: parseFloat(s.gtfs_latitude),
                            lng: parseFloat(s.gtfs_longitude),
                            address: [s.address, s.city, s.state, s.zipcode].join(' ')
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
            BartService.$inject = ['$q', '$http'];
            return BartService;
        })();
        Services.BartService = BartService;

        Transit.App.service('bartService', BartService);
    })(Transit.Services || (Transit.Services = {}));
    var Services = Transit.Services;
})(Transit || (Transit = {}));
//# sourceMappingURL=bart.js.map
