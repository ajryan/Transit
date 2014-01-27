module Transit.Services {
    export interface IStation {
        name: string;
        abbrev: string;
        lat: number;
        lng: number;
        address: string;
    }

    export interface ITransitService {
        getStations(): ng.IPromise<IStation[]>;
    }
} 