using DbContexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.StaticFiles;

namespace YourProjectNamespace.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PhysicalFileController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly AppDbContext _db;
        private readonly FileExtensionContentTypeProvider _contentTypeProvider;

        public PhysicalFileController(IWebHostEnvironment env, AppDbContext db)
        {
            _env = env;
            _db = db;
            _contentTypeProvider = new FileExtensionContentTypeProvider();
        }

        [HttpGet("{id}")]
        public IActionResult GetUserFile(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var file = _db.Files.FirstOrDefault(f => f.Id == id);

            if (file == null)
                return NotFound();

            if (file.UserId != int.Parse(userId))
                return Forbid();

            if (string.IsNullOrEmpty(file.FilePath))
                return NotFound("Dosya yolu boş");

            try
            {
                var safeFilePath = file.FilePath.TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
                var fullPath = Path.Combine(_env.ContentRootPath, "uploads", safeFilePath);

                Console.WriteLine($"Dosya yolu: {fullPath}");

                if (!System.IO.File.Exists(fullPath))
                    return NotFound("Dosya fiziksel olarak bulunamadı");

                string contentType;
                if (!_contentTypeProvider.TryGetContentType(fullPath, out contentType))
                {
                    contentType = "application/octet-stream"; // fallback
                }

                Console.WriteLine($"MIME Türü: {contentType}");

                byte[] fileBytes;
                try
                {
                    fileBytes = System.IO.File.ReadAllBytes(fullPath);
                }
                catch (IOException ioEx)
                {
                    return StatusCode(500, $"Dosya okunamadı: {ioEx.Message}");
                }

                // ÖNEMLİ: inline ile açılabilir hale getir
                Response.Headers.Add("Content-Disposition", $"inline; filename=\"{file.Name}\"");

                return File(fileBytes, contentType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Sunucu hatası: {ex.Message}\n\n{ex.StackTrace}");
            }
        }
        [HttpGet("filemeta/{id}")]
        public IActionResult GetFileMeta(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var file = _db.Files.FirstOrDefault(f => f.Id == id);

            if (file == null)
                return NotFound();

            if (file.UserId != int.Parse(userId))
                return Forbid();

            return Ok(new
            {
                file.Id,
                file.Name,
                file.Description,
                file.FilePath
            });
        }




    }


}
