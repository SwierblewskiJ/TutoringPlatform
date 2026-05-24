import toast from "react-hot-toast";
import { fetchData } from "../services/ApiService";
import { LessonStatus, type Lesson } from "../types/TutoringAds";

const TutorDashboard = ({lessons, onRefresh}: {lessons: Lesson[]; onRefresh: () => void}) => {
    const handleStatusUpdate = async (id:number, newStatus: LessonStatus) => {
        try{
            await fetchData(`/Lessons/${id}/status`,{
                method:"PUT",
                body: {status: newStatus}
            });
            onRefresh();
        } catch(error:any){
            toast.error(error);
        }
    }

    if(lessons.length===0) return <p className="no-data">Brak nowych rezerwacji od uczniów.</p>

    return(
        <div className="lessons-list">
            {lessons.map((lesson) => (
                <div key={lesson.id} className="lesson-card tutor-card">
                    <div className="lesson-info">
                        <h3>{lesson.tutoringAd?.title || "Ogłoszenie"}</h3>
                        <p>Uczeń: <strong>{lesson.student?.name || "Anonim"}</strong>({lesson.student?.email})</p>
                        <p>Termin: <strong>{new Date(lesson.startTime).toLocaleString('pl-PL')}</strong></p>
                    </div>
                    
                    <div className="lesson-actions">
                        {lesson.status === LessonStatus.Pending ? (
                            <>
                                <button className="btn-success" onClick={() => handleStatusUpdate(lesson.id, LessonStatus.Confirmed)}>Potwierdź</button>
                                <button className="btn-danger" onClick={()=> handleStatusUpdate(lesson.id, LessonStatus.Cancelled)}>Anuluj</button>
                            </>
                        ) : (
                            renderStatusBadge(lesson.status)
                        )}
                    </div>

                </div>
            ))}
        </div>
    );

    const renderStatusBadge = (status: LessonStatus) => {
    switch (status) {
        case LessonStatus.Pending: return <span className="status-badge pending">⏳ Oczekuje</span>;
        case LessonStatus.Confirmed: return <span className="status-badge confirmed">✅ Potwierdzona</span>;
        case LessonStatus.Cancelled: return <span className="status-badge cancelled">❌ Anulowana</span>;
        case LessonStatus.Completed: return <span className="status-badge completed">🎓 Ukończona</span>;
        default: return null;
    }
}
    
};

export default TutorDashboard;