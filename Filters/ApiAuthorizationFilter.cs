using InvoiceTrackerApp.Dto.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;

namespace InvoiceTrackerApp.Filters
{
    public class ApiAuthorizationFilter(IOptions<AppSettings> _tokenSettings) : IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            HttpRequest request = context.HttpContext.Request;
            var apiKey = request.Headers["X-Api-Key"].FirstOrDefault();
            if (string.IsNullOrEmpty(apiKey) || apiKey != _tokenSettings.Value.ApiKey)
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}
