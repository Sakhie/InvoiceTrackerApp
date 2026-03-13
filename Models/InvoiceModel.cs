using InvoiceTrackerApp.Enums;
using System.ComponentModel.DataAnnotations;

namespace InvoiceTrackerApp.Models
{
    public class InvoiceModel
    {
        [Key]
        public int InvoiceNumber { get; set; }
        public required CustomerModel Customer { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal InvoiceAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal Balance { get; set; }
        public InvoiceStatus Status { get; set; }
    }
}
