using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TutoringPlatform.DTOs;
using TutoringPlatform.Services;

namespace TutoringPlatform.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TutorAvailabilitiesController : ControllerBase
{
    private readonly ITutorAvailabilitiesService _tutorAvailabilitiesService;
    
    public TutorAvailabilitiesController(ITutorAvailabilitiesService tutorAvailabilitiesService)
    {
        _tutorAvailabilitiesService = tutorAvailabilitiesService;
    }

    [HttpGet("ad/{adId}")]
    public async Task<IActionResult> GetByAdId(int adId)
    {
        var availabilities = await _tutorAvailabilitiesService.GetByAdIdAsync(adId);
        return Ok(availabilities);
    }

    [Authorize(Roles = "Tutor")]
    [HttpPost("ad/{adId}")]
    public async Task<IActionResult> AddAvailability(int adId, CreateTutorAvailabilityDto dto)
    {
        var tutorIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(tutorIdString, out int tutorId)) return Unauthorized();

        try
        {
            var result = await _tutorAvailabilitiesService.AddAsync(adId, dto, tutorId);
            if (result == null) return NotFound(new { error = "Nie znaleziono ogłoszenia." });

            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = "Tutor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAvailability(int id)
    {
        var tutorIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(tutorIdString, out int tutorId)) return Unauthorized();

        try
        {
            var success = await _tutorAvailabilitiesService.DeleteAsync(id, tutorId);
            if (!success) return NotFound(new { error = "Nie znaleziono takiego slotu w grafiku." });

            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }
}