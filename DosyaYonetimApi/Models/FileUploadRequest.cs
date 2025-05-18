using System.ComponentModel.DataAnnotations;

namespace FileManagementApi.Models
{
    public class FileUploadRequest
    {
        [Required]
        public IFormFile File { get; set; } = null!;

        [Required]
        public string Name { get; set; } = null!;

        public string Description { get; set; } = string.Empty;
    }
}
