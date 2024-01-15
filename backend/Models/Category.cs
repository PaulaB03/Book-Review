using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Category
    {
        [Key] 
        [Column("category_id")] 
        public int Id { get; set; }

        [Required]
        [Column("category_name")]
        public string Name { get; set; }
    }
}
