using System;
using System.ComponentModel.DataAnnotations;

namespace FileManagementApi.Models
{
    public class FileRecord
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime UploadDate { get; set; }
        public string FilePath { get; set; } = null!;

        public int UserId { get; set; } // JWT ile eşleşecek kullanıcı ID'si
    }
}
