using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using DbContexts;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(AppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserDto request)
    {
        if (_context.Users.Any(u => u.Username == request.Username))
            return BadRequest("Kullanıcı adı zaten mevcut.");

        var user = new User
        {
            Username = request.Username,
            PasswordHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(request.Password)))
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("Kayıt başarılı.");
    }

    [HttpPost("login")]
    public IActionResult Login(UserDto request)
    {
        var user = _context.Users.SingleOrDefault(u => u.Username == request.Username);
        if (user == null)
            return Unauthorized("Kullanıcı bulunamadı.");

        var passwordHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(request.Password)));
        if (user.PasswordHash != passwordHash)
            return Unauthorized("Şifre yanlış.");

        var token = _tokenService.CreateToken(user);
        return Ok(new { token });
    }
}

public class UserDto
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
