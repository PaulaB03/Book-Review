using backend.Models;
using System.Security.Claims;

namespace backend.Services
{
    public interface IAuthorizationService
    {
        IEnumerable<Claim> GetClaims(User user);
    }
}
