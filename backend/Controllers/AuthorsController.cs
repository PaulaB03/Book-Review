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
        public ActionResult<IEnumerable<Author>> GetAuthors()
        {
            return _context.Author;
        }

        // GET: api/Author/{id}
        [HttpGet("{id}")]
        public ActionResult<Author> GetAuthor(int id)
        {
            var author = _context.Author.FirstOrDefault(a => a.Id == id);

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
            // Check if the name is unique
            if (_context.Author.Any(a => a.Name == author.Name))
            {
                ModelState.AddModelError("Name", "The name must be unique.");
                return BadRequest(ModelState);
            }

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

            // Check if the updated name is unique (excluding the current author)
            if (_context.Author.Any(a => a.Id != id && a.Name == updatedAuthor.Name))
            {
                ModelState.AddModelError("Name", "The name must be unique.");
                return BadRequest(ModelState);
            }

            existingAuthor.Name = updatedAuthor.Name;
            existingAuthor.Bio = updatedAuthor.Bio;

            _context.SaveChanges();

            return Ok(existingAuthor);
        }

    }
}
