using InvoiceTrackerApp.Dto;
using InvoiceTrackerApp.Services.Interfaces;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceTrackerApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("AllowAll")]
    public class UserController(ISecurityService _securityService) : ControllerBase
    {
        
        [HttpPost("signup")]
        public async Task<IActionResult> Register([FromBody] UserDto user)
        {
            if(user == null)
                return BadRequest("User details not supplied");

            var token = await _securityService.RegisterUserAsync(user);
            if (string.IsNullOrEmpty(token))
                return BadRequest("Failed to register user");

            return Ok(new { Token = token });
        }
        
        [HttpPost("signin")]
        public async Task<IActionResult> Login([FromBody] UserDto user)
        {
            if (user == null)
                return BadRequest("User details not supplied");

            var token = await _securityService.LoginUserAsync(user);
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalid credentials");

            return Ok(new { Token = token });
        }

        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {
            return Ok("from the api");
        }
    }
}
