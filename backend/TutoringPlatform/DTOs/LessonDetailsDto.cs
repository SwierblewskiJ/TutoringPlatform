namespace TutoringPlatform.DTOs;

public class LessonDetailsDto
{
    public int Id { get; set; }
    public required DateTime StartTime { get; set; }
    public required string Status { get; set; }
    public required bool IsRecurring { get; set; }
    public int? RemainingLessons { get; set; }
    public required string AdTitle { get; set; }
    
    //dla ucznia: imie nauczyciela
    //dla nauczyciela: imie ucznia
    public required string RelatedUser { get; set; }
}