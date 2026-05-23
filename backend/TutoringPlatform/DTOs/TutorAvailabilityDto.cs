namespace TutoringPlatform.DTOs;

public class TutorAvailabilityDto
{
    public int Id { get; set; }
    public required string DayOfWeek { get; set; }
    public required TimeSpan StartTime { get; set; }
    public required TimeSpan EndTime { get; set; }
}