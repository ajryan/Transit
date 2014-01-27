module Transit.Services {
    'use strict';

    export class AgencyService {
        public getAvailableAgencies(): string[] {
            return ['BART'];
        }
    }

    App.service('agencyService', AgencyService);
}