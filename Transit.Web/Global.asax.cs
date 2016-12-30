using System;
using System.Web.Http;
using System.Web.Optimization;

namespace Transit.Web
{
    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            BundleTable.Bundles.Add(new ScriptBundle("~/bundles/app")
                .Include(
                    "~/scripts/leaflet-{version}.js",
                    "~/scripts/xml2json.js",
                    "~/scripts/angular.js",
                    "~/scripts/angular-resource.js",
                    "~/scripts/angular-route.js",
                    "~/app/app.js",
                    //"~/app/models/*.js",
                    "~/app/services/*.js",
                    "~/app/controllers/*.js",
                    //"~/app/directives/*.js"
                    "~/scripts/angular-leaflet-directive.js"));

            BundleTable.Bundles.Add(new StyleBundle("~/bundles/css")
                .Include(
                    "~/content/leaflet.css",
                    "~/content/reset.css",
                    "~/content/site.css"));

            WebApiConfig.Register(GlobalConfiguration.Configuration);
        }
    }
}