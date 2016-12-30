namespace Transit.Web.Models
{
  public class ClienteerContact : IStation
  {
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string name { get; set; }
    public string abbrev { get; set; }
    public double lat { get; set; }
    public double lng { get; set; }
    public string address { get; set; }
    public bool visible { get; set; }
  }
}