using InvoiceTrackerApp.Dto;
using InvoiceTrackerApp.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceTrackerApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController(IInvoiceService _invoiceService) : ControllerBase
    {
        [HttpGet("all")]
        public async Task<IActionResult> GetAllInvoicesAsync()
        {
            var invoicesResult = await _invoiceService.GetAllInvoicesAsync();
            if (invoicesResult == null)
            {
                return BadRequest("Failed retrieving invoices");
            }
            return Ok(invoicesResult);
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateInvoiceAsync([FromBody] InvoiceDto Invoice)
        {
            var newInvoiceResult = await _invoiceService.CreateInvoiceAsync(Invoice);
            if (newInvoiceResult == null)
            {
                return BadRequest("Failed creating user");
            }
            return Ok(newInvoiceResult);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetInvoiceByIdAsync(int id)
        {
            var userResult = await _invoiceService.GetInvoiceByIdAsync(id);
            if (userResult == null)
            {
                return BadRequest("Failed retrieving user");
            }
            return Ok(userResult);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteInvoiceAsync(int id)
        {
            var deleteResult = await _invoiceService.DeleteInvoiceAsync(id);
            if (deleteResult <= 0)
            {
                return BadRequest("Failed deleting");
            }
            return Ok(true);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateInvoiceAsync([FromBody] InvoiceDto Invoice)
        {
            var updateResult = await _invoiceService.UpdateInvoiceAsync(Invoice);
            if (updateResult <= 0)
            {
                return BadRequest("Failed updating");
            }
            return Ok(true);
        }

    }

}
