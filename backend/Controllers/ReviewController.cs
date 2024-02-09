using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.NetworkInformation;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private DataContext _context;

        public ReviewController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Status/{bookId}
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews(int userId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.UserId == userId)
                .Include(u => u.User)
                .Include(u => u.Book).ThenInclude(b => b.Author)
                .ToListAsync();

            if (reviews == null || !reviews.Any())
            {
                return NotFound("No reviews found for the specified user.");
            }

            return reviews;
        }

        // GET: api/Status/{bookId}
        [HttpGet("{bookId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetStatuses(int bookId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.BookId == bookId)
                .Include(u => u.User)
                .Include(u => u.Book).ThenInclude(b => b.Author)
                .ToListAsync();

            if (reviews == null || !reviews.Any())
            {
                return NotFound("No reviews found for the specified book.");
            }

            return reviews;
        }

        // GET: api/Review/{bookId}/{userId}
        [HttpGet("{bookId}/{userId}")]
        public async Task<ActionResult<Review>> GetReview(int bookId, int userId)
        {
            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.UserId == userId && r.BookId == bookId);

            if (review == null)
            {
                return NotFound();
            }

            return review;
        }

        // POST: api/Review
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            try
            {
                // Check if the user has already reviewed the book
                var existingReview = await _context.Reviews
                    .FirstOrDefaultAsync(r => r.UserId == review.UserId && r.BookId == review.BookId);

                if (existingReview != null)
                {
                    return BadRequest("User has already reviewed this book.");
                }

                // Check if the rating is between 1 and 5
                if (review.Rating < 1 || review.Rating > 5)
                {
                    return BadRequest("Rating must be between 1 and 5.");
                }

                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetReview), new { bookId = review.BookId, userId = review.UserId }, review);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        // PUT: api/Review/{bookId}/{userId}
        [HttpPut("{bookId}/{userId}")]
        [Authorize]
        public async Task<IActionResult> PutReview(int bookId, int userId, Review updatedReview)
        {
            try
            {
                // Check if the rating is between 1 and 5
                if (updatedReview.Rating < 1 || updatedReview.Rating > 5)
                {
                    return BadRequest("Rating must be between 1 and 5.");
                }

                var existingReview = await _context.Reviews.FirstOrDefaultAsync(r => r.UserId == userId && r.BookId == bookId);

                if (existingReview == null)
                {
                    return NotFound("Review not found for the specified user and book.");
                }

                existingReview.Rating = updatedReview.Rating;
                existingReview.Comment = updatedReview.Comment;

                await _context.SaveChangesAsync();

                return Ok(existingReview);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }


        // DELETE: api/Review/{bookId}/{userId}
        [HttpDelete("{bookId}/{userId}")]
        [Authorize]
        public async Task<IActionResult> DeleteStatus(int bookId, int userId)
        {
            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.UserId == userId && r.BookId == bookId);
            
            if (review == null)
            {
                return NotFound();
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Review removed!" });
        }

        // GET: api/Review/TotalRating/{bookId}
        [HttpGet("TotalRating/{bookId}")]
        public async Task<ActionResult<double>> GetTotalRating(int bookId)
        {
            var reviews = await _context.Reviews.Where(r => r.BookId == bookId).ToListAsync();

            if (!reviews.Any())
            {
                return Ok(0.0);
            }

            var totalRating = reviews.Average(r => r.Rating);

            return Ok(totalRating);
        }

    }
}
