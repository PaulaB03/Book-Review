using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<User>  Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Author> Author { get; set; }
        public DbSet<Status> Status { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Author and Book
            modelBuilder.Entity<Book>()
                .HasOne(b => b.Author)
                .WithMany(a => a.Books)
                .HasForeignKey(b => b.AuthorId);

            base.OnModelCreating(modelBuilder);

            // Status, User, Book
            modelBuilder.Entity<Status>()
                .HasKey(s => new { s.UserId, s.BookId });

            modelBuilder.Entity<Status>()
                .HasOne(b => b.Book)
                .WithMany(s => s.Status)
                .HasForeignKey(s => s.BookId);

            modelBuilder.Entity<Status>()
                .HasOne(u => u.User)
                .WithMany(s => s.Status)
                .HasForeignKey(s => s.UserId);

            // Review, User, Book
            modelBuilder.Entity<Review>()
                .HasKey(r => new { r.UserId, r.BookId });

            modelBuilder.Entity<Review>()
                .HasOne(b => b.Book)
                .WithMany(r => r.Reviews)
                .HasForeignKey(r => r.BookId);

            modelBuilder.Entity<Review>()
                .HasOne(u => u.User)
                .WithMany(r => r.Reviews)
                .HasForeignKey(r => r.UserId);


            base.OnModelCreating(modelBuilder);
        }
    }
}
