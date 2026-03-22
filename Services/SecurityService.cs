using InvoiceTrackerApp.Dto;
using InvoiceTrackerApp.Dto.Settings;
using InvoiceTrackerApp.Helpers;
using InvoiceTrackerApp.Models;
using InvoiceTrackerApp.Persistance;
using InvoiceTrackerApp.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

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
                    var userPermissions = GetUserPermissions(foundUser.UserId);
                    userToken = SecurityHelper.GenerateUserJwtToken(foundUser, _tokenSettings, userPermissions);
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

            var userToken = SecurityHelper.GenerateUserJwtToken(userModel, _tokenSettings);
            return await Task.FromResult(userToken);
        }        
        private List<string>? GetUserPermissions(Guid userId)
        {
            return _appDbContext.UserRoles.Where(x => x.UserId == userId).Select(x=>x.Permission).ToList();
        }        
    }
}
