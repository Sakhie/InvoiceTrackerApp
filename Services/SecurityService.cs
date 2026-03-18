using InvoiceTrackerApp.Dto;
using InvoiceTrackerApp.Dto.Settings;
using InvoiceTrackerApp.Models;
using InvoiceTrackerApp.Persistance;
using InvoiceTrackerApp.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InvoiceTrackerApp.Services
{
    public class SecurityService(
         IOptions<TokenSettings> tokenSettings,
         AppDbContext _appDbContext,
         IPasswordHasher<UserModel> _passwordHasher
         ) : ISecurityService
    {
        private readonly TokenSettings _tokenSettings = tokenSettings.Value;
        public async Task<string> LoginUserAsync(UserDto user)
        {
            var userToken = string.Empty;
            
            var foundUser = await _appDbContext.Users.FirstOrDefaultAsync(x=> x.Email == user.Email);
            if (foundUser != null)
            {
                var verification = _passwordHasher.VerifyHashedPassword(foundUser, foundUser.Password, user.Password);
                if (verification == PasswordVerificationResult.Success)
                {
                    userToken = GenerateJwtToken(foundUser);
                }
            }
            return await Task.FromResult(userToken);
        }
        public async Task<string> RegisterUserAsync(UserDto user)
        {
            var hashedPassword = _passwordHasher.HashPassword(null, user.Password);
            user.Password = hashedPassword;

            var userModel = new UserModel() { Password = hashedPassword, Email = user.Email, UserId = Guid.NewGuid() };

            await _appDbContext.Users.AddAsync(userModel);
            await _appDbContext.SaveChangesAsync();

            var userToken = GenerateJwtToken(userModel);
            return await Task.FromResult(userToken);
        }
        private string GenerateJwtToken(UserModel user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };
            /*
             * permissions = List<string>
            foreach (var permission in permissions)
            {
                claims.Add(new Claim("permission", permission)); // Custom permission claim
            }
            */
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
        public static bool HasPermissions(string token, string permissionName)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = (JwtSecurityToken)tokenHandler.ReadToken(token);
                // The Claims property returns a collection of Claim objects
                var claimValue = securityToken.Claims.FirstOrDefault(c => c.Type == permissionName)?.Value;
                if (claimValue != null)
                    return true;

                return false;
            }
            catch (System.Exception)
            {
                // Log the exception (e.g., token is invalid or malformed)
                return false;
            }
        }


    }
}
