using InvoiceTrackerApp.Dto.Settings;
using InvoiceTrackerApp.Models;
using InvoiceTrackerApp.Persistance;
using InvoiceTrackerApp.Services;
using InvoiceTrackerApp.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace InvoiceTrackerApp
{
    public static class ServicesConfiguration
    {
        public static void AddAppSettings(this IServiceCollection services, ConfigurationManager configuration)
        {
            services.Configure<TokenSettings>(configuration.GetSection("TokenSettings"));
            services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection")
            ));
        }
        public static void AddAppCors(this IServiceCollection services, ConfigurationManager configuration)
        {
            var allowedCors = configuration.GetSection("AppSettings").GetValue<string>("AllowedCors");

            services.AddCors(opt =>
                opt.AddPolicy(allowedCors ?? "",
                    opt => opt.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin()
                )
            );
        }
        public static void AddAppAuthentication(this IServiceCollection services, ConfigurationManager configuration)
        {
            var tokenSettings = configuration.GetSection("TokenSettings");
            var jwtSecrete = tokenSettings.GetValue<string>("JwtSecrete");
            var issuer = tokenSettings.GetValue<string>("Issuer");
            var audience = tokenSettings.GetValue<string>("Audience");

            var tokenValidationPars = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecrete ?? ""))
            };

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = tokenValidationPars;
                });
        }
        public static void AddAppServices(this IServiceCollection services)
        {
            services.AddScoped<IPasswordHasher<UserModel>, PasswordHasher<UserModel>>();
            services.AddScoped<ISecurityService, SecurityService>(); 
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IInvoiceService, InvoiceService>();
        }
    }
}
