using System.ComponentModel.DataAnnotations;

namespace InvoiceTrackerApp.Models
{
    public class CustomerModel
    {
        [Key]
        public int CustomerId { get; set; }
        public required string CustomerName { get; set; }
        public string ContactNumber { get; set; } = string.Empty;
    }
}
