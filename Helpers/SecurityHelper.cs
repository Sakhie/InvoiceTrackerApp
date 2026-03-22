using InvoiceTrackerApp.Dto.Settings;
using InvoiceTrackerApp.Enums;
using InvoiceTrackerApp.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InvoiceTrackerApp.Helpers
{
    public static class SecurityHelper
    {
        public static string GenerateUserJwtToken(UserModel user, TokenSettings _tokenSettings, List<string>? userRoles = null)
        {
            /*
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };
            */
            var claims = new List<Claim>(){
                new Claim(TokenClaims.NameIdentifier.ToString(), user.UserId.ToString()),
                new Claim(TokenClaims.EmailAddress.ToString(), user.Email)
            };

            //User roles
            if (userRoles != null)
            {
                foreach (var role in userRoles)
                {
                    claims.Add(new Claim(TokenClaims.Role.ToString(), role)); // Custom permission claim
                }
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenSettings.JwtSecrete));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                    issuer: _tokenSettings.Issuer,
                    audience: _tokenSettings.Audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(_tokenSettings.ExpiryInHours),
                    signingCredentials: creds
                 );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }       
        public static string? GetClaimsByToken(string token, string claim)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = (JwtSecurityToken)tokenHandler.ReadToken(token);
                // The Claims property returns a collection of Claim objects
                var claimValue = securityToken.Claims.FirstOrDefault(c => c.Type == claim)?.Value;
                if (claimValue != null)
                    return claimValue;
            }
            catch (System.Exception)
            {
                // Log the exception (e.g., token is invalid or malformed)
                return null;
            }

            return null;
        }
    }
}
