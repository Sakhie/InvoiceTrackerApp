using System.Text.Json.Serialization;
namespace InvoiceTrackerApp.Enums
{
    public enum TokenClaims
    {
        [JsonPropertyName("nameidentifier")]
        NameIdentifier,
        [JsonPropertyName("emailaddress")]
        EmailAddress,
        [JsonPropertyName("role")]
        Role
    }
}
