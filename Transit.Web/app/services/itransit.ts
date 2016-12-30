// leaflet
declare module L {
    export function latLng(lat: number, lng: number): any;
    export function point(x: number, y: number): any;
}

module Transit.Web.Models {
    //export interface IStation {
    //    name: string;
    //    abbrev: string;
    //    lat: number;
    //    lng: number;
    //    address: string;
    //    visible: boolean;
    //}

    export interface IDeparture {
        destination: string;
        times: IDepartureTime[];
    }
    export interface IDepartureTime {
        minutes: number;
        info: string;
    }

    export interface ITransitService {
        getStations(): ng.IPromise<IStation[]>;
    }
} 