using InvoiceTrackerApp.Dto;

namespace InvoiceTrackerApp.Services.Interfaces
{
    public interface ISecurityService
    {
        Task<string> LoginUserAsync(UserDto user);
        Task<string> RegisterUserAsync(UserDto user);
    }
}
