using InvoiceTrackerApp.Dto;
using InvoiceTrackerApp.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceTrackerApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController(ICustomerService _customerService) : ControllerBase
    {
        [HttpGet("all")]
        public async Task<IActionResult> GetAllCustomersAsync()
        {
            var usersResult = await _customerService.GetAllCustomersAsync();
            if (usersResult == null)
            {
                return BadRequest("Failed retrieving users");
            }
            return Ok(usersResult);
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateCustomerAsync([FromBody] CustomerDto customer)
        {
            var newCustomerResult = await _customerService.CreateCustomerAsync(customer);
            if (newCustomerResult == null)
            {
                return BadRequest("Failed creating user");
            }
            return Ok(newCustomerResult);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetCustomerByIdAsync(int id)
        {
            var userResult = await _customerService.GetCustomerByIdAsync(id);
            if (userResult == null)
            {
                return BadRequest("Failed retrieving user");
            }
            return Ok(userResult);
        }
                
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCustomerAsync(int id)
        {
            var deleteResult = await _customerService.DeleteCustomerAsync(id);
            if (deleteResult <= 0)
            {
                return BadRequest("Failed deleting");
            }
            return Ok(true);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateCustomerAsync([FromBody] CustomerDto customer)
        {
            var updateResult = await _customerService.UpdateCustomerAsync(customer);
            if(updateResult <= 0)
            {
                return BadRequest("Failed updating");
            }
            return Ok(true);
        }
    }
}
