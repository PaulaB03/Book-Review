using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Review
    {
        [Key, Column(Order = 0)]
        [Required]
        public int UserId { get; set; }
        [Key, Column(Order = 1)]
        [Required]
        public int BookId { get; set; }
        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public User? User { get; set; }
        public Book? Book { get; set; }
    }
}
