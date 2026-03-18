using System.Text.Json.Serialization;

namespace InvoiceTrackerApp.Dto
{
    public class InvoiceDto
    {
        [JsonPropertyName("invoiceNumber")]
        public required int InvoiceNumber { get; set; }
        [JsonPropertyName("customerId")]
        public required int CustomerId { get; set; }
        [JsonPropertyName("invoiceDate")]
        public DateTime InvoiceDate { get; set; }
        [JsonPropertyName("dueDate")]
        public DateTime DueDate { get; set; }
        [JsonPropertyName("invoiceAmount")]
        public decimal InvoiceAmount { get; set; }
        [JsonPropertyName("paidAmount")]
        public decimal PaidAmount { get; set; }
        [JsonPropertyName("balance")]
        public decimal Balance { get; set; }
        [JsonPropertyName("statusId")]
        public int StatusId { get; set; }
    }
}
