using Microsoft.EntityFrameworkCore;

namespace InvoiceTrackerApp.Models
{
    [Keyless]
    public class UserRoleModel
    {
        public Guid UserId { get; set; }
        public required string Permission { get; set; }
    }
}
