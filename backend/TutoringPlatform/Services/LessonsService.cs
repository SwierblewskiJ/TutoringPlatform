using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using TutoringPlatform.Data;
using TutoringPlatform.DTOs;
using TutoringPlatform.Models;

namespace TutoringPlatform.Services;

public interface ILessonsService
{
    Task<Lesson?> BookLessonAsync(int studentId, BookLessonDto bookLessonDto);
    Task<bool> ChangeStatusByTutorAsync(int tutorId, int lessonId, LessonStatus newStatus);
    Task<bool> CancelByStudentAsync(int studentId, int lessonId);
    Task<IEnumerable<LessonDetailsDto>> GetMyLessonsAsync(int userId, string role);
}

public class LessonsService : ILessonsService
{
    private readonly ApplicationDbContext _context;
    
    public LessonsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Lesson?> BookLessonAsync(int studentId, BookLessonDto bookLessonDto)
    {
        var availability = await _context.TutorAvailabilities
            .FirstOrDefaultAsync(a => a.Id == bookLessonDto.TutorAvailabilityId);

        if (availability == null)
        {
            return null;
        }

        var utcStartDate = bookLessonDto.StartDate.ToUniversalTime();
        
        if (utcStartDate <= DateTime.UtcNow.AddDays(1))
        {
            throw new InvalidOperationException("Rezerwacji można dokonać z co najmniej 1-dniowym wyprzedzeniem");
        }

        var isOccupied = await _context.Lessons
            .AnyAsync(l => l.TutorAvailabilityId == bookLessonDto.TutorAvailabilityId 
                                && l.Status != LessonStatus.Cancelled);

        if (isOccupied)
        {
            throw new InvalidOperationException("Ten termin jest już zarezerwowany");
        }

        var lesson = new Lesson
        {
            StartTime = utcStartDate,
            IsRecurring = bookLessonDto.IsRecurring,
            RemainingLessons = bookLessonDto.PackageCount,
            Status = LessonStatus.Pending,
            StudentId = studentId,
            TutoringAdId = availability.TutoringAdId,
            TutorAvailabilityId = availability.Id
        };
        
        _context.Lessons.Add(lesson);
        await _context.SaveChangesAsync();
        
        return lesson;
    }

    public async Task<bool> ChangeStatusByTutorAsync(int tutorId, int lessonId, LessonStatus newStatus)
    {
        var lesson = await _context.Lessons
            .Include(l => l.TutoringAd)
            .FirstOrDefaultAsync(l => l.Id == lessonId);
        
        if (lesson == null)
        {
            return false;
        }

        if (lesson.TutoringAd!.TutorId != tutorId)
        {
            throw new UnauthorizedAccessException("Brak uprawnień do modyfikacji tej lekcji");
        }
        
        lesson.Status = newStatus;
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> CancelByStudentAsync(int studentId, int lessonId)
    {
        var lesson = await _context.Lessons.FirstOrDefaultAsync(l => l.Id == lessonId);

        if (lesson == null)
        {
            return false;
        }

        if (lesson.StudentId != studentId)
        {
            throw new UnauthorizedAccessException("Brak uprawnień. Możesz odwołać tylko własne zajęcia");
        }

        if (lesson.Status == LessonStatus.Completed)
        {
            throw new InvalidOperationException("Nie można odwołać lekcji, która już się zakończyła");
        }
        
        lesson.Status = LessonStatus.Cancelled;
        await _context.SaveChangesAsync();
        
        return true;
    }
    
    public async Task<IEnumerable<LessonDetailsDto>> GetMyLessonsAsync(int userId, string role)
    {
        var query = _context.Lessons
            .Include(l => l.TutoringAd)
            .ThenInclude(a => a!.Tutor)
            .Include(l => l.Student)
            .AsQueryable();

        if (role.Equals("Student", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(l => l.StudentId == userId);
        }
        else if (role.Equals("Tutor", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(l => l.TutoringAd!.TutorId == userId);
        }

        var lessons = await query.OrderByDescending(l => l.StartTime).ToListAsync();

        return lessons.Select(l => new LessonDetailsDto
        {
            Id = l.Id,
            StartTime = l.StartTime,
            Status = l.Status.ToString(),
            IsRecurring = l.IsRecurring,
            RemainingLessons = l.RemainingLessons,
            AdTitle = l.TutoringAd!.Title,
            RelatedUser = role.Equals("Student", StringComparison.OrdinalIgnoreCase)
                ? l.TutoringAd.Tutor!.Name
                : l.Student!.Name
        });
    }
}