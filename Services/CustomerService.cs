using InvoiceTrackerApp.Dto;
using InvoiceTrackerApp.Models;
using InvoiceTrackerApp.Persistance;
using InvoiceTrackerApp.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace InvoiceTrackerApp.Services
{
    public class CustomerService(AppDbContext _appDbContext) : ICustomerService
    {
        public async Task<CustomerDto> CreateCustomerAsync(CustomerDto customer)
        {
            var customerModel = new CustomerModel()
            {
                 CustomerName = customer.Name,
                 ContactNumber = customer.Number                 
            };            
            await _appDbContext.Customers.AddAsync(customerModel);
            await _appDbContext.SaveChangesAsync();

            customer.Id = customerModel.CustomerId;
            return customer;
        }

        public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
        {
            var customers = from cust in await _appDbContext.Customers.ToListAsync()
                                 select new CustomerDto()
                                 {
                                     Id = cust.CustomerId,
                                     Name = cust.CustomerName,
                                     Number = cust.ContactNumber
                                 };            
            return customers;
        }

        public async Task<CustomerDto?> GetCustomerByIdAsync(int Id)
        {
            var foundCustomer = await _appDbContext.Customers.FirstOrDefaultAsync(x => x.CustomerId == Id);
            if (foundCustomer != null)
            {
                return new CustomerDto()
                {
                    Id = foundCustomer.CustomerId,
                    Name = foundCustomer.CustomerName,
                    Number = foundCustomer.ContactNumber
                };
            }           
            return null;
        }

        public async Task<int> UpdateCustomerAsync(CustomerDto customer)
        {
            var found = await _appDbContext.Customers.FirstOrDefaultAsync(x => x.CustomerId == customer.Id);
            if (found != null)
            {
                found.CustomerName = customer.Name;
                found.ContactNumber = customer.Number;

                _appDbContext.Customers.Update(found);
                return await _appDbContext.SaveChangesAsync();
            }
            return 0;
        }

        public async Task<int> DeleteCustomerAsync(int Id)
        {
            var found = await _appDbContext.Customers.FirstOrDefaultAsync(x => x.CustomerId == Id);
            if (found != null)
            {
                _appDbContext.Customers.Remove(found);
                return await _appDbContext.SaveChangesAsync();                
            }
            return 0;
        }
    }
}
