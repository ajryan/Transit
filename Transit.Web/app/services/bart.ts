module Transit.Services {
    'use strict';

    // external xml2json library with no TypeScript definitions
    declare var X2JS;

    export class BartService implements ITransitService {
        static $inject = ['$q', '$http'];

        private _x2js: any;
        private _xmlJsTransform = {
            transformResponse: (data: any) => {
                var json = this._x2js.xml_str2json(data);
                return json;
            }
        };

        private _stations: IStation[];

        constructor(private $q: ng.IQService, private $http: ng.IHttpService) {
            this._x2js = new X2JS();
            this._stations = null;
        }

        public getStations(): ng.IPromise<IStation[]> {
            var deferred = this.$q.defer();

            if (this._stations !== null) {
                deferred.resolve(this._stations);
                return deferred.promise;
            }

            this.$http.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V', this._xmlJsTransform).success((data: any) => {
                var stations: IStation[] = data.root.stations.station.map(s => {
                    var station: IStation =  {
                        name: s.name,
                        abbrev: s.abbr,
                        lat: parseFloat(s.gtfs_latitude),
                        lng: parseFloat(s.gtfs_longitude),
                        address: [s.address, s.city, s.state, s.zipcode].join(' '),
                        visible: true
                    };
                    return station;
                });
                this._stations = stations;
                deferred.resolve(stations);
            }).error(() => {
                deferred.reject('Error calling BART API.');
            });

            return deferred.promise;
        }

        public getDepartures(origin: string): ng.IPromise<IDeparture[]> {
            var deferred = this.$q.defer();

            this.$http.get('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + origin + '&key=MW9S-E7SL-26DU-VV8V', this._xmlJsTransform).success(data => {
                if (!data.root.station.hasOwnProperty('etd')) {
                    deferred.resolve([]);
                }
                var departures: IDeparture[] = [];
                // normalize to array in single etd case
                if (data.root.station.etd.hasOwnProperty('estimate')) {
                    var singleEtd = data.root.station.etd;
                    data.root.station.etd = [singleEtd];
                }
                data.root.station.etd.forEach(etd => {
                    // normalize to array in single departure case
                    if (etd.estimate.hasOwnProperty('direction')) {
                        var singleEstimate = etd.estimate;
                        etd.estimate = [singleEstimate];
                    }
                    var departure: IDeparture = {
                        destination: etd.destination,
                        times: etd.estimate.map(estimate => {
                            return {
                                minutes: estimate.minutes == 'Leaving' ? 0 : estimate.minutes,
                                info: 'Platform: ' + estimate.platform + '; Cars: ' + estimate.length
                            };
                        })
                    };
                    departures.push(departure);
                });
                deferred.resolve(departures);
            }).error(() => {
                deferred.reject('Error calling BART API.');
            });

            return deferred.promise;
        }
    }

    App.service('bartService', BartService);
}