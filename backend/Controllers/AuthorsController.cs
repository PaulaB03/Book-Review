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
    public class AuthorController : ControllerBase
    {
        private readonly DataContext _context;

        public AuthorController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Author
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Author>>> GetAuthors()
        {
            return await _context.Author.ToListAsync();
        }

        // GET: api/Author/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Author>> GetAuthor(int id)
        {
            var author = await _context.Author.FindAsync(id);

            if (author == null)
            {
                return NotFound();
            }

            return author;
        }

        // POST: api/Author
        [HttpPost]
        [Authorize(Roles = "admin")]
        public ActionResult<Author> PostAuthor(Author author)
        {
            _context.Author.Add(author);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAuthor), new { id = author.Id }, author);
        }

        // PUT: api/Author/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult PutAuthor(int id, [FromBody] Author updatedAuthor)
        {
            var existingAuthor = _context.Author.Find(id);

            if (existingAuthor == null)
            {
                return NotFound();
            }

            existingAuthor.Name = updatedAuthor.Name;
            existingAuthor.Bio = updatedAuthor.Bio;

            _context.SaveChanges();

            return Ok(existingAuthor);
        }
    }
}
