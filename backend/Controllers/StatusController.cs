
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private DataContext _context;

        public StatusController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Status/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Status>>> GetStatuses(int userId)
        {
            var statuses = await _context.Status
                .Where(s => s.UserId == userId)
                .Include(b => b.Book)
                .ToListAsync();

            if (statuses == null || !statuses.Any())
            {
                return NotFound("No statuses found for the specified user.");
            }

            return statuses;
        }

        // GET: api/Status/{userId}/{bookId}
        [HttpGet("{userId}/{bookId}")]
        public async Task<ActionResult<Status>> GetStatus(int userId, int bookId)
        {
            var status = await _context.Status.Include(b => b.Book).FirstOrDefaultAsync(s => s.UserId == userId && s.BookId == bookId);

            if (status == null)
            {
                return NotFound();
            }

            return status;
        }

        // POST: api/Status
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Status>> PostStatus(Status status)
        {
            // Check if the userId is valid
            if (status.UserId <= 0)
            {
                return BadRequest("Invalid UserId");
            }

            var user = await _context.Users.FindAsync(status.UserId);
            if (user == null)
            {
                return BadRequest("Specified UserId does not exist.");
            }

            // Check if the bookId is valid
            if (status.BookId <= 0)
            {
                return BadRequest("Invalid BookId");
            }

            var book = await _context.Books.FindAsync(status.BookId);
            if (book == null)
            {
                return BadRequest("Specified BookId does not exist.");
            }

            // Check if the ReadingStatus is valid
            if (!Enum.IsDefined(typeof(ReadingStatus), status.ReadingStatus))
            {
                return BadRequest("Invalid ReadingStatus value");
            }

            status.User = user;
            status.Book = book;

            try
            {
                _context.Status.Add(status);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetStatus), new { userId = status.UserId, bookId = status.BookId }, status);
            }
            catch (DbUpdateException ex)
            {
                // Duplicate key violation
                if (ex.InnerException is SqlException sqlException && sqlException.Number == 2627)
                {
                    return Conflict("Status with the same UserId and BookId already exists.");
                }
                else
                {
                    return StatusCode(500, "An error occurred while saving the entity changes.");
                }
            }
        }

        // PUT: api/Status/{userId}/{bookId}
        [HttpPut("{userId}/{bookId}")]
        [Authorize]
        public async Task<IActionResult> ChangeStatus(int userId, int bookId, [FromBody] ReadingStatus newReadingStatus)
        {
            var existingStatus = await _context.Status
                .FirstOrDefaultAsync(s => s.UserId == userId && s.BookId == bookId);

            if (existingStatus == null)
            {
                return NotFound("Status not found for the specified user and book.");
            }

            existingStatus.ReadingStatus = newReadingStatus;
            await _context.SaveChangesAsync();


            return Ok(new { Message = "Status changed!" });
        }

        // DELETE: api/Status/{userId}/{bookId}
        [HttpDelete("{userId}/{bookId}")]
        [Authorize]
        public async Task<IActionResult> DeleteStatus(int userId, int bookId)
        {
            var status = await _context.Status.FirstOrDefaultAsync(s => s.UserId == userId && s.BookId == bookId);

            if (status == null)
            {
                return NotFound();
            }

            _context.Status.Remove(status);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Status removed!" });
        }
    }
}
