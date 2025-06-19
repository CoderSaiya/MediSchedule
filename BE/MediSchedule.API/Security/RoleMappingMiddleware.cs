using System.Security.Claims;
using MediSchedule.Infrastructure.Services;

namespace BE.Security;

public class RoleMappingMiddleware(
    RequestDelegate next, 
    EndpointRoleMappingService mappingService,
    ILogger<RoleMappingMiddleware> logger
    )
{
    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value ?? "";
        var method = context.Request.Method;
        
        var mapping = mappingService.FindMatching(path, method);
        if (mapping == null || mapping.AllowedRoles == null || !mapping.AllowedRoles.Any())
        {
            await next(context);
            return;
        }
        
        if (!(context.User?.Identity?.IsAuthenticated ?? false))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.CompleteAsync();
            return;
        }
        
        var role = context.User.FindFirst(ClaimTypes.Role)?.Value;
        if (string.IsNullOrEmpty(role))
        {
            logger.LogWarning("[Authorization] Token không có claim role, forbidden {Method} {Path}", method, path);
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return;
        }
        
        if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            logger.LogDebug("[Authorization] User is Admin, bypass check for {Method} {Path}", method, path);
            await next(context);
            return;
        }
        
        var match = mapping.AllowedRoles.Any(ar => string.Equals(ar, role, StringComparison.OrdinalIgnoreCase));
        if (match)
        {
            logger.LogDebug("[Authorization] User role {Role} allowed for {Method} {Path}", role, path);
            await next(context);
            return;
        }
        else
        {
            logger.LogWarning("[Authorization] Forbidden: user role {Role} not in {Allowed} for {Method} {Path}",
                role, string.Join(",", mapping.AllowedRoles), method, path);
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return;
        }
    }
}