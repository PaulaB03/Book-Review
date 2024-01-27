using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public enum ReadingStatus
    {
        Read,
        Reading,
        WantToRead
    }
    public class Status
    {
        [Key, Column(Order = 0)]
        [Required]
        public int UserId { get; set; }
        [Key, Column(Order = 1)]
        [Required]
        public int BookId {  get; set; }
        [JsonIgnore]
        public User? User { get; set; }
        [JsonIgnore]
        public Book? Book { get; set; }
        [Required]
        public ReadingStatus ReadingStatus { get; set; }
    }
}
