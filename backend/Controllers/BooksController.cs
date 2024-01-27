using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly DataContext _context;

        public BooksController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            return await _context.Books.Include(b => b.Author).ToListAsync();
        }

        // GET: api/Books/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.Include(b => b.Author).FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // POST: api/books
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            if (book.AuthorId <= 0)
            {
                return BadRequest("AuthorId must be specified.");
            }

            var author = await _context.Author.FindAsync(book.AuthorId);
            if (author == null)
            {
                return BadRequest("Specified AuthorId does not exist.");
            }

            book.Author = author;
            _context.Books.Add(book);

            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

        // PUT: api/Books/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult PutBook(int id, [FromBody] Book updatedBook)
        {
            var existingBook = _context.Books.Find(id);

            if (existingBook == null)
            {
                return NotFound();
            }

            // Update the properties
            existingBook.Title = updatedBook.Title;
            existingBook.Description = updatedBook.Description;
            existingBook.CoverUrl = updatedBook.CoverUrl;

            _context.SaveChanges();

            return Ok(existingBook);
        }
    }
}
