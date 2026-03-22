using InvoiceTrackerApp.Dto.Settings;
using InvoiceTrackerApp.Enums;
using InvoiceTrackerApp.Helpers;
using InvoiceTrackerApp.Models;
using InvoiceTrackerApp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace InvoiceTrackerApp.Filters
{
    public class RolesAuthorizationAttribute(string roleName) : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            HttpRequest request = context.HttpContext.Request;
            var token = request.Headers["Authorization"].FirstOrDefault();

            token = token.Replace("Bearer ", "");
            var role = SecurityHelper.GetClaimsByToken(token, TokenClaims.Role.ToString());
            if (string.IsNullOrEmpty(role))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            if (role != roleName)
            {
                context.Result = new UnauthorizedResult();
            }

            base.OnActionExecuting(context);
        }
    }
}
