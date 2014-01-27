module Transit.Services {
    'use strict';

    // external xml2json library with no TypeScript definitions
    declare var X2JS;

    export class BartService implements ITransitService {
        static $inject = ['$q', '$http'];

        private _x2js: any;

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

            this.$http.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V', {
                transformResponse: (data: any)=> {
                    var json = this._x2js.xml_str2json(data);
                    return json;
                }
            }).success((data: any, s)=> {
                var stations: IStation[] = data.root.stations.station.map(s=> {
                    var station: IStation =  {
                        name: s.name,
                        abbrev: s.abbr,
                        lat: s.gtfs_latitude,
                        lng: s.gtfs_longitude,
                        address: [s.address, s.city, s.state, s.zipcode].join(' ') 
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
    }

    App.service('bartService', BartService);
}