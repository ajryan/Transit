using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;

using Dapper;
using Geocoding.Microsoft;

using Transit.Web.Models;

namespace Transit.Web.Controllers
{
  public class ClienteerContactsController : ApiController
  {
    // GET api/<controller>
    public IEnumerable<ClienteerContact> Get()
    {
      using (var conn = new SqlConnection("Server=CLIENTEER;Database=ITGClienteer;User Id=SQL_DI;Password=!@#C#.sqllogin;"))
      {
        conn.Open();

        var contacts = conn.Query<ClienteerContact>(@"SELECT TOP 500
                                                      ISNULL(firstName + ' ', '') + ISNULL(lastName, '') as name,
                                                      ISNULL(SUBSTRING(businessAddress, CHARINDEX(CHAR(10), businessAddress) + 1, LEN(businessAddress)) + N', ',   '') +
                                                        ISNULL(businessCity + N', ',   '') +
                                                        ISNULL(businessState + N' ',   '') +
                                                        ISNULL(businessZip + N' ',     '') +
                                                        ISNULL(businessCountry + N' ', '') AS address
                                                      FROM tblContact").ToList();

        FillLatLong(contacts);

        return contacts;
      }
    }

    private void FillLatLong(List<ClienteerContact> contacts)
    {
      var geocoder = new BingMapsGeocoder("AtQb168Xtv0RdBlgvWF65lTaz7LJQo9lM9gm6VV7FePA1lP4CFAH7_fs9FwSM7dT");

      try
      {
        foreach (var contact in contacts)
        {
          if (String.IsNullOrWhiteSpace(contact.address))
            continue;

          var addresses = geocoder.Geocode(contact.address);
          var firstAddress = addresses.FirstOrDefault();

          if (firstAddress == null)
            continue;

          contact.abbrev = contact.name.Replace(" ", String.Empty);

          contact.lat = firstAddress.Coordinates.Latitude;
          contact.lng = firstAddress.Coordinates.Longitude;
        }
      }
      catch { }
    }
  }
}