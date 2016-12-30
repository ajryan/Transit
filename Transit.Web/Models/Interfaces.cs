
namespace Transit.Web.Models
{
  public interface IStation
  {
    string name { get; }
    string abbrev { get; }
    double lat { get; }
    double lng { get; }
    string address { get; }
    bool visible { get; }
  }

  public interface IDeparture
  {
    string destination { get; }
    IDepartureTime[] times { get; }
  }

  public interface IDepartureTime
  {
    int minutes { get; }
    string info { get; }
  }
}