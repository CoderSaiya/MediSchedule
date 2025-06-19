using System.Text.RegularExpressions;
using MediSchedule.Domain.Common;
using Microsoft.Extensions.Configuration;

namespace MediSchedule.Infrastructure.Services;

public class EndpointRoleMappingService
{
    private readonly List<EndpointRoleMapping> _mappings;
    
    public EndpointRoleMappingService(IConfiguration config = null!)
    {
        _mappings = new List<EndpointRoleMapping>();
        config.GetSection("EndpointRoleMappings").Bind(_mappings);

        // Chuẩn bị regex cho mỗi mapping
        foreach (var m in _mappings)
        {
            m.PathRegex = BuildRegexFromTemplate(m.Template);
        }
    }
    
    private static Regex BuildRegexFromTemplate(string template)
    {
        string pattern = Regex.Escape(template);
        pattern = Regex.Replace(pattern, @"\\\{([^}]+)\\\}", match =>
        {
            var inside = match.Groups[1].Value;
            if (inside == "*" || inside == "**" || inside.StartsWith("*"))
                return ".*";
            return "[^/]+";
        });
        pattern = pattern.Replace("\\*", ".*");
        pattern = "^" + pattern + "$";
        return new Regex(pattern, RegexOptions.IgnoreCase);
    }

    public EndpointRoleMapping? FindMatching(string path, string method)
    {
        // Lọc những mapping mà method khớp (or method = "*" or null)
        var candidates = _mappings
            .Where(m =>
                string.IsNullOrEmpty(m.HttpMethod) 
                || m.HttpMethod == "*" 
                || string.Equals(m.HttpMethod, method, StringComparison.OrdinalIgnoreCase))
            .ToList();

        // Trong số candidates, tìm những cái path regex match
        var matched = candidates
            .Where(m => m.PathRegex != null && m.PathRegex.IsMatch(path))
            .ToList();
        if (!matched.Any()) return null;

        // Nếu có nhiều, chọn cái Template dài hơn (cụ thể hơn) trước
        var best = matched
            .OrderByDescending(m => m.Template.Length)
            .First();
        return best;
    }
}