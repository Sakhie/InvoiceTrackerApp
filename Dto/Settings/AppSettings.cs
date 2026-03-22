namespace InvoiceTrackerApp.Dto.Settings
{
    public class AppSettings
    {
        public string? AllowedCors { get; set; }
        public string[]? Permissions { get; set; }
        public string? ApiKey { get; set; }
    }
}
