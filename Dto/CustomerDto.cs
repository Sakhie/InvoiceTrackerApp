using System.Text.Json.Serialization;

namespace InvoiceTrackerApp.Dto
{
    public class CustomerDto
    {
        [JsonPropertyName("id")]
        public required int Id { get; set; }
        [JsonPropertyName("name")]
        public required string Name { get; set; }
        [JsonPropertyName("number")]
        public string Number { get; set; } = string.Empty;
    }
}
