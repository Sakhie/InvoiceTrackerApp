using InvoiceTrackerApp.Dto.Settings;
using InvoiceTrackerApp.Enums;
using InvoiceTrackerApp.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace InvoiceTrackerApp.Filters
{
    public class AuthenticationFilter() : IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            HttpRequest request = context.HttpContext.Request;
            var token = request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(token))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            token = token.Replace("Bearer ", "");
            var userId = SecurityHelper.GetClaimsByToken(token, TokenClaims.NameIdentifier.ToString());
            if (string.IsNullOrEmpty(userId))
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}
