﻿using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly PasswordService _passwordService;

        public UserController(DataContext context, IConfiguration configuration, PasswordService passwordService)
        {
            _context = context;
            _configuration = configuration;
            _passwordService = passwordService;
        }

        // POST: api/user/register
        [HttpPost("register")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            try
            {
                // Validate the password
                _passwordService.ValidatePasswordRequirments(user.Password);

                // Check if email is unique
                if (_context.Users.Any(u => u.Email == user.Email))
                {
                    return BadRequest("Email is already in use. Please choose a different email.");
                }

                // Check if username is unique
                if (_context.Users.Any(u => u.Username == user.Username))
                {
                    return BadRequest("Username is already in use. Please choose a different username.");
                }

                // Encrypt the password before storing it
                user.Password = _passwordService.HashPassword(user.Password);

                // Set user role
                user.Role = "user";

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUser", new { id = user.Id }, user);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }

        } 

        // POST: api/user/login
        [HttpPost("login")]
        public ActionResult<string> Login(Login login)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == login.Email);

            if (user == null || !_passwordService.VerifyPassword(login.Password, user.Password))
            {
                return Unauthorized("Invalid email or password");
            }

            // Return a JWT token upon successful login
            var token = GenerateJwtToken(user);
            user.Password = "";

            // Log the token payload
            Console.WriteLine("Token Payload: " + new JwtSecurityTokenHandler().ReadToken(token));

            return Ok(new { Token = token, User = user });
        }

        // GET: api/user/id
        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<User> GetUser(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        
        // PUT: api/user/updateRole/{id}
        [HttpPut("updateRole/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<User>> UpdateUserRole(int id, string newRole)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound();
                }

                // Check if the provided role is either 'user' or 'admin'
                if (newRole.ToLower() != "user" && newRole.ToLower() != "admin")
                {
                    return BadRequest("Invalid role. Role must be either 'user' or 'admin'.");
                }

                // Update user role
                user.Role = newRole;
                await _context.SaveChangesAsync();

                return Ok(user);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)  // Add user role directly
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(1); // Set token expiration to one hour

            var token = new JwtSecurityToken(
                _configuration["Jwt:ValidIssuer"],
                _configuration["Jwt:ValidAudience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
