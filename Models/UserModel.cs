using System.ComponentModel.DataAnnotations;

namespace InvoiceTrackerApp.Models
{
    public class UserModel
    {
        [Key]
        public Guid UserId { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
