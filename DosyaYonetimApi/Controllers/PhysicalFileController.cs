using DbContexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PhysicalFileController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly AppDbContext _db;

    public PhysicalFileController(IWebHostEnvironment env, AppDbContext db)
    {
        _env = env;
        _db = db;
    }

    [HttpGet("{id}")]
    public IActionResult GetUserFile(int id)
    {
        // JWT'den kullanıcı ID'sini al
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                     User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        // Dosya kaydını veritabanından al
        var file = _db.Files.FirstOrDefault(f => f.Id == id);

        if (file == null)
            return NotFound();

        // Bu dosya bu kullanıcıya mı ait?
        if (file.UserId != int.Parse(userId))
            return Forbid();

        // Fiziksel dosya yolu oluştur
        var fullPath = Path.Combine(_env.ContentRootPath, file.FilePath.TrimStart('/'));

        if (!System.IO.File.Exists(fullPath))
            return NotFound("Dosya fiziksel olarak bulunamadı");

        var contentType = "application/octet-stream"; // İsteğe göre MIME tipi belirlenebilir
        return PhysicalFile(fullPath, contentType, file.Name);
    }
}
