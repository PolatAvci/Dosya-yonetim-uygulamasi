using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FileManagementApi.Models;
using DbContexts;
using System.Security.Claims;

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

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetFiles()
        {
            var userId = GetUserId();

            var files = await _context.Files
                .AsNoTracking()
                .Where(f => f.UserId == userId)
                .ToListAsync();

            return Ok(files);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFileById(int id)
        {
            var file = await _context.Files
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.Id == id && f.UserId == GetUserId());

            if (file == null)
                return NotFound(new { message = "Dosya bulunamadı veya yetkiniz yok." });

            return Ok(file);
        }

        [Authorize]
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
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
                FilePath = uniqueFileName,
                UserId = GetUserId()
            };

            _context.Files.Add(newFileRecord);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Dosya yüklendi.", newFileRecord.Id });
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var fileRecord = await _context.Files.FindAsync(id);

            if (fileRecord == null || fileRecord.UserId != GetUserId())
                return NotFound("Dosya bulunamadı veya silme yetkiniz yok.");

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
