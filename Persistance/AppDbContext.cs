using InvoiceTrackerApp.Models;
using Microsoft.EntityFrameworkCore;

namespace InvoiceTrackerApp.Persistance
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options)
        {

        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<CustomerModel> Customers { get; set; }
        public DbSet<InvoiceModel> Invoices { get; set; }
    }
}
