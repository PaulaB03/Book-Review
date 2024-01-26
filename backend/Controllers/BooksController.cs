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
        public ActionResult<IEnumerable<Book>> GetBooks()
        {
            return _context.Books.Include(b => b.Author).ToList();
        }

        // GET: api/Books/{id}
        [HttpGet("{id}")]
        public ActionResult<Book> GetBook(int id)
        {
            var book = _context.Books.Include(b => b.Author).FirstOrDefault(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // POST: api/Books
        [HttpPost]
        [Authorize(Roles = "admin")]
        public ActionResult<Book> PostBook([FromBody] Book book)
        {
            // Check if the author already exists
            var existingAuthor = _context.Author.FirstOrDefault(a => a.Name == book.Author.Name);

            if (existingAuthor == null)
            {
                // If the author doesn't exist, add it to the context
                var newAuthor = new Author { Name = book.Author.Name };
                _context.Author.Add(newAuthor);

                book.Author = newAuthor;
            }

            _context.Books.Add(book);
            _context.SaveChanges();

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
