using System.Text.RegularExpressions;

namespace MediSchedule.Domain.Common;

public class EndpointRoleMapping
{
    public string Template { get; set; } = "";
    public string? HttpMethod { get; set; }
    public List<string>? AllowedRoles { get; set; }
    public Regex? PathRegex { get; set; }
}