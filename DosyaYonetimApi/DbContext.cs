using Microsoft.EntityFrameworkCore;
using FileManagementApi.Models;

namespace DbContexts
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<FileRecord> Files { get; set; }
        public DbSet<User> Users => Set<User>();
    }
}
