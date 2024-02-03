using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class User
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public required string Username { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
        public string? FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; } = string.Empty;
        [JsonIgnore]
        [NotMapped]
        private string _role = "user";
        [Required]
        public string Role
        {
            get => _role;
            set
            {
                // Validate that the role is either "user" or "admin"
                if (value == "user" || value == "admin")
                {
                    _role = value;
                }
                else
                {
                    _role = "user";
                }
            }
        }
        [JsonIgnore]
        public ICollection<Status>? Status { get; set; }
        [JsonIgnore]
        public ICollection<Review> Reviews { get; set; }

        // Constructor to set default values, including the default role
        public User()
        {
            Role = "user";
        }
    }
}
