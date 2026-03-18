namespace InvoiceTrackerApp.Dto.Settings
{
    public class TokenSettings
    {
        public required string JwtSecrete { get; set; }
        public required string Issuer { get; set; }
        public required string Audience { get; set; }
        public int ExpiryInHours { get; set; }
    }
}
