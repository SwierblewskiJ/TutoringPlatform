using Microsoft.EntityFrameworkCore;
using TutoringPlatform.Data;
using TutoringPlatform.DTOs;
using TutoringPlatform.Models;

namespace TutoringPlatform.Services;

public interface ITutorAvailabilitiesService
{
    Task<IEnumerable<TutorAvailabilityDto>> GetByAdIdAsync(int adId);
    Task<TutorAvailabilityDto?> AddAsync(int adId, CreateTutorAvailabilityDto dto, int tutorId);
    Task<bool> DeleteAsync(int id, int tutorId);
}

public class TutorAvailabilitiesService : ITutorAvailabilitiesService
{
    private readonly ApplicationDbContext _context;
    
    public TutorAvailabilitiesService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<TutorAvailabilityDto>> GetByAdIdAsync(int adId)
    {
        var availabilities = await _context.TutorAvailabilities
            .Where(a => a.TutoringAdId == adId)
            .OrderBy(a => a.DayOfWeek)
            .ThenBy(a => a.StartTime)
            .ToListAsync();

        return availabilities.Select(a => new TutorAvailabilityDto
        {
            Id = a.Id,
            DayOfWeek = a.DayOfWeek.ToString(),
            StartTime = a.StartTime,
            EndTime = a.EndTime
        });
    }
    
    public async Task<TutorAvailabilityDto?> AddAsync(int adId, CreateTutorAvailabilityDto dto, int tutorId)
    {
        var ad = await _context.TutoringAds.FirstOrDefaultAsync(a => a.Id == adId);
        if (ad == null) return null;

        if (ad.TutorId != tutorId)
        {
            throw new UnauthorizedAccessException("Nie możesz zarządzać grafikiem tego ogłoszenia");
        }

        if (dto.StartTime >= dto.EndTime)
        {
            throw new InvalidOperationException("Godzina rozpoczęcia musi być wcześniejsza niż godzina zakończenia");
        }

        var totalDuration = dto.EndTime - dto.StartTime;

        if (totalDuration.TotalMinutes < 45 || totalDuration.TotalHours > 3)
        {
            throw new InvalidOperationException("Lekcja musi trwać między 45 minut a 3 godziny");
        }
        
        var availability = new TutorAvailability
        {
            TutoringAdId = adId,
            DayOfWeek = dto.DayOfWeek,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime
        };

        _context.TutorAvailabilities.Add(availability);
        await _context.SaveChangesAsync();

        return new TutorAvailabilityDto
        {
            Id = availability.Id,
            DayOfWeek = availability.DayOfWeek.ToString(),
            StartTime = availability.StartTime,
            EndTime = availability.EndTime
        };
    }
    
    public async Task<bool> DeleteAsync(int id, int tutorId)
    {
        var availability = await _context.TutorAvailabilities
            .Include(a => a.TutoringAd)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (availability == null) return false;

        if (availability.TutoringAd!.TutorId != tutorId)
        {
            throw new UnauthorizedAccessException("Nie możesz usunąć tego slotu.");
        }

        _context.TutorAvailabilities.Remove(availability);
        await _context.SaveChangesAsync();
        return true;
    }
}