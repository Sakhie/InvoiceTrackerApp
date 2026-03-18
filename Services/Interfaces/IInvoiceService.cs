using InvoiceTrackerApp.Dto;
using InvoiceTrackerApp.Models;

namespace InvoiceTrackerApp.Services.Interfaces
{
    public interface IInvoiceService
    {
        Task<InvoiceDto?> CreateInvoiceAsync(InvoiceDto invoice);
        Task<IEnumerable<InvoiceDto>> GetAllInvoicesAsync();
        Task<InvoiceDto?> GetInvoiceByIdAsync(int Id);
        Task<int> UpdateInvoiceAsync(InvoiceDto invoice);
        Task<int> DeleteInvoiceAsync(int Id);
    }
}
