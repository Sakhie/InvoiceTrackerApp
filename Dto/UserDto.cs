using System.Text.Json.Serialization;

namespace InvoiceTrackerApp.Dto
{
    public class UserDto
    {
        [JsonPropertyName("id")]
        public Guid? Id { get; set; }
        [JsonPropertyName("email")]
        public string? Email { get; set; }
        [JsonPropertyName("password")]
        public string? Password { get; set; }
    }
}
