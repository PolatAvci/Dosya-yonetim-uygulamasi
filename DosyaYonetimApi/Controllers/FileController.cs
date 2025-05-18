using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FileManagementApi.Models;
using DbContexts;

namespace FileManagementApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public FilesController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetFiles()
        {
            var files = await _context.Files.AsNoTracking().ToListAsync();
            return Ok(files);
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")] // Swagger için gerekli!
        public async Task<IActionResult> Upload([FromForm] FileUploadRequest request)
        {
            var file = request.File;
            if (file == null || file.Length == 0)
                return BadRequest("Dosya seçilmedi.");

            var allowedExtensions = new[] { ".pdf", ".png", ".jpg", ".jpeg" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(ext))
                return BadRequest("Sadece PDF, PNG, JPG ve JPEG dosyalar yüklenebilir.");

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var newFileRecord = new FileRecord
            {
                Name = request.Name,
                Description = request.Description,
                UploadDate = DateTime.UtcNow,
                FilePath = uniqueFileName
            };

            _context.Files.Add(newFileRecord);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Dosya yüklendi.", newFileRecord.Id });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var fileRecord = await _context.Files.FindAsync(id);
            if (fileRecord == null)
                return NotFound("Dosya bulunamadı.");

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads");
            var filePath = Path.Combine(uploadsFolder, fileRecord.FilePath);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            _context.Files.Remove(fileRecord);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Dosya silindi." });
        }
    }
}
