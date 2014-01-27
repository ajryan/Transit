var Transit;
(function (Transit) {
    (function (Services) {
        'use strict';

        var AgencyService = (function () {
            function AgencyService() {
            }
            AgencyService.prototype.getAvailableAgencies = function () {
                return ['BART'];
            };
            return AgencyService;
        })();
        Services.AgencyService = AgencyService;

        Transit.App.service('agencyService', AgencyService);
    })(Transit.Services || (Transit.Services = {}));
    var Services = Transit.Services;
})(Transit || (Transit = {}));
//# sourceMappingURL=agencies.js.map
