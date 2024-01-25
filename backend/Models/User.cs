using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class User
    {
        [Key]
        [Required]
        [JsonIgnore]
        [Column("user_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [Column("username")]
        public string Username { get; set; }
        [Required]
        [Column("email")]
        public string Email { get; set; }
        [Required]
        [Column("password")]
        public string Password { get; set; }
        [Column("first_name")]
        public string FirstName { get; set; } = string.Empty;
        [Column("last_name")]
        public string LastName { get; set; } = string.Empty;
        [JsonIgnore]
        private string _role = "user";
        [Required]
        [Column("role")]
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

        // Constructor to set default values, including the default role
        public User()
        {
            Role = "user";
        }
    }
}
