using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Book
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public required string Title { get; set; }
        public int AuthorId {  get; set; }
        public Author? Author { get; set; }
        public string? Description { get; set; }
        public string? CoverUrl { get; set; }
        [JsonIgnore]
        public ICollection<Status> Status { get; set; }
        [JsonIgnore]
        public ICollection<Review> Reviews { get; set; }
    }
}
