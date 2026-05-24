import { LessonStatus, type Lesson } from "../types/TutoringAds";

const StudentDashboard = ({lessons}: {lessons: Lesson[]}) => {
    if(lessons.length === 0 ) return <p className="no-data">Nie masz jeszcze zaplanowanych lekcji.</p>

    const renderStatusBadge = (status: LessonStatus) => {
    switch (status) {
        case LessonStatus.Pending: return <span className="status-badge pending">⏳ Oczekuje</span>;
        case LessonStatus.Confirmed: return <span className="status-badge confirmed">✅ Potwierdzona</span>;
        case LessonStatus.Cancelled: return <span className="status-badge cancelled">❌ Anulowana</span>;
        case LessonStatus.Completed: return <span className="status-badge completed">🎓 Ukończona</span>;
        default: return null;
    }
};

    return (
        <div className="lessons-list">
            {lessons.map((lesson) => (
                <div key={lesson.id} className="lesson-card">
                    <div className="lesson-info">
                        <h3>{lesson.tutoringAd?.title || "Ogłoszenie"}</h3>
                        <p>Termin: <strong>{new Date(lesson.startTime).toLocaleString('pl-PL')}</strong></p>
                    </div>
                    <div className="lesson-status-price">
                        {renderStatusBadge(lesson.status)}
                        <span className="price">{lesson.tutoringAd?.price} zł/h</span>
                    </div>
                </div>
            ))}
        </div>
    );

};
export default StudentDashboard;