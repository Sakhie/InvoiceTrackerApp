using InvoiceTrackerApp.Dto;
using InvoiceTrackerApp.Enums;
using InvoiceTrackerApp.Models;
using InvoiceTrackerApp.Persistance;
using InvoiceTrackerApp.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.Threading.Tasks;

namespace InvoiceTrackerApp.Services
{
    public class InvoiceService(AppDbContext _appDbContext) : IInvoiceService
    {
        private async Task<CustomerModel?> GetCustomerById(int id)
        {
            return await _appDbContext.Customers.FirstOrDefaultAsync(x=>x.CustomerId == id);
        }
        private static InvoiceStatus GetInvoiceStatus(decimal invoiceAmount, decimal paidAmount, DateTime dueDate)
        {
            if (invoiceAmount == paidAmount)
                return InvoiceStatus.Paid;

            if (paidAmount == 0)
                return InvoiceStatus.UnPaid;

            if (dueDate < DateTime.UtcNow)
                return InvoiceStatus.OverDue;            

            return InvoiceStatus.PartiallyPaid;
        }
        private InvoiceDto InvoiceModelToDto(InvoiceModel invoice)
        {
            return new InvoiceDto()
            {
                Balance = invoice.Balance,
                CustomerId = invoice.CustomerId,
                DueDate = invoice.DueDate,
                InvoiceAmount = invoice.InvoiceAmount,
                InvoiceDate = invoice.InvoiceDate,
                InvoiceNumber = invoice.InvoiceNumber,
                PaidAmount = invoice.PaidAmount,
                StatusId = (int)invoice.Status
            };
        }
        private static void AssigningInvoiceModelHelper(ref InvoiceModel invoiceModel, InvoiceDto invoiceDto)
        {
            invoiceModel.Balance = (invoiceDto.InvoiceAmount - invoiceDto.PaidAmount);
            invoiceModel.DueDate = invoiceDto.DueDate;
            invoiceModel.InvoiceAmount = invoiceDto.InvoiceAmount;
            invoiceModel.InvoiceDate = invoiceDto.InvoiceDate;
            invoiceModel.PaidAmount = invoiceDto.PaidAmount;
            invoiceModel.Status = GetInvoiceStatus(invoiceDto.InvoiceAmount, invoiceDto.PaidAmount, invoiceDto.DueDate);
        }
        public async Task<InvoiceDto?> CreateInvoiceAsync(InvoiceDto invoice)
        {
            /*
            var customer = await GetCustomerById(invoice.CustomerId);
            if (customer == null)
            {
                return null;
            }*/

            var invoiceModel = new InvoiceModel()
            {
                InvoiceNumber = invoice.InvoiceNumber,
                CustomerId = invoice.CustomerId
            };
            AssigningInvoiceModelHelper(ref invoiceModel, invoice);

            await _appDbContext.Invoices.AddAsync(invoiceModel);
            await _appDbContext.SaveChangesAsync();

            invoice.InvoiceNumber = invoiceModel.InvoiceNumber;
            return invoice;
        }
        public async Task<IEnumerable<InvoiceDto>> GetAllInvoicesAsync()
        {
            var invoices = from inv in await _appDbContext.Invoices.ToListAsync()
                                 select InvoiceModelToDto(inv);
            return invoices;
        }
        public async Task<InvoiceDto?> GetInvoiceByIdAsync(int Id)
        {
            var foundInvoice = await _appDbContext.Invoices.FirstOrDefaultAsync(x => x.InvoiceNumber == Id);
            if (foundInvoice != null)
            {
                return InvoiceModelToDto(foundInvoice);
            }           
            return null;
        }
        public async Task<int> UpdateInvoiceAsync(InvoiceDto invoice)
        {
            var found = await _appDbContext.Invoices.FirstOrDefaultAsync(x => x.InvoiceNumber == invoice.InvoiceNumber);
            if (found != null)
            {
                AssigningInvoiceModelHelper(ref found, invoice);

                _appDbContext.Invoices.Update(found);
                return await _appDbContext.SaveChangesAsync();
            }
            return 0;
        }
        public async Task<int> DeleteInvoiceAsync(int Id)
        {
            var found = await _appDbContext.Invoices.FirstOrDefaultAsync(x => x.InvoiceNumber == Id);
            if (found != null)
            {
                _appDbContext.Invoices.Remove(found);
                return await _appDbContext.SaveChangesAsync();                
            }
            return 0;
        }
    }
}
