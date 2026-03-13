using InvoiceTrackerApp.Dto;
using InvoiceTrackerApp.Models;

namespace InvoiceTrackerApp.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<CustomerDto> CreateCustomerAsync(CustomerDto customer);
        Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
        Task<CustomerDto?> GetCustomerByIdAsync(int Id);
        Task<int> UpdateCustomerAsync(CustomerDto customer);
        Task<int> DeleteCustomerAsync(int Id);
    }
}
