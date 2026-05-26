import { LessonStatus, type Lesson } from "../types/TutoringAds";
import { fetchData } from "../services/ApiService";
import toast from "react-hot-toast";

import { FaHourglassHalf } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { IoMdDoneAll } from "react-icons/io";
import { useEffect, useState } from "react";



interface TutorDashboardProps {
    lessons: Lesson[];
    onRefresh: () => void;
}

const TutorDashboard = ({ lessons: initialLessons,  onRefresh }: TutorDashboardProps) => {
    const [localLessons, setLocalLessons] = useState<Lesson[]>(initialLessons);

    useEffect(() => {
        setLocalLessons(initialLessons);
    }, [initialLessons]);
    
    const handleStatusChange = async (lessonId: number, newStatusValue: number) => {
    try {
        setLocalLessons(prev => 
            prev.map(lesson => 
                lesson.id === lessonId 
                    ? { ...lesson, status: newStatusValue as any } 
                    : lesson
            )
        );

        // Strzał do API (zostaje bez zmian)
        await fetchData(`/Lessons/${lessonId}/status`, {
            method: "PATCH",
            body: { status: newStatusValue }
        });

        toast.success(newStatusValue === LessonStatus.Confirmed ? "Zaakceptowano lekcję!" : "Odrzucono lekcję.");
        
        onRefresh(); 
    } catch (error) {
        console.error("Błąd podczas zmiany statusu lekcji:", error);
        setLocalLessons(initialLessons);
    }
};

    const renderStatusBadge = (status: any) => {
        if (status === LessonStatus.Pending || status === "Pending") {
            return <span className="status-badge status-pending"><FaHourglassHalf /> Oczekiwanie</span>;
        }
        if (status === LessonStatus.Confirmed || status === "Confirmed") {
            return <span className="status-badge status-confirmed"><GiConfirmed /> Potwierdzono</span>;
        }
        if (status === LessonStatus.Cancelled || status === "Cancelled") {
            return <span className="status-badge status-cancelled"><MdCancel /> Anulowano</span>;
        }
        if (status === LessonStatus.Completed || status === "Completed") {
            return <span className="status-badge status-completed"><IoMdDoneAll /> Ukończono</span>;
        }
        return <span className="status-badge status-default">{status}</span>;
    };

    if (!localLessons || localLessons.length === 0) {
        return <p className="no-data">Brak nowych rezerwacji od uczniów.</p>;
    }

    return (
        <div className="lessons-list">
            {localLessons.map((lesson: any) => {
                const id = lesson.id;
                const adTitle = lesson.adTitle || "Lekcja";
                const studentName = lesson.relatedUser || "Uczeń";
                const startTime = lesson.startTime;
                const isRecurring = lesson.isRecurring;
                const remainingLessons = lesson.remainingLessons;
                const rawStatus = lesson.status; 

                const datePart = startTime.split("T")[0]; 
                const [year, month, day] = datePart.split("-").map(Number);

                const timePart = startTime.split("T")[1].slice(0, 5); 

                const formattedDate = `${day} ${new Date(year, month - 1, day).toLocaleString("pl-PL", { month: "long" })} ${year} o godzinie ${timePart}`;


                return (
                    <div key={id} className="lesson-card">
                        <div className="lesson-info">
                            <div className="lesson-header-row">
                                <h4>{adTitle}</h4>
                                {renderStatusBadge(rawStatus)}
                            </div>
                            
                            <p>Uczeń: <strong>{studentName}</strong></p>
                            <p>Termin: <span className="time-text">{formattedDate}</span></p>
                            
                            {isRecurring && (
                                <span className="recurring-badge">
                                    Cykliczne (Pozostało lekcji: {remainingLessons})
                                </span>
                            )}
                        </div>

                        {(rawStatus === "Pending" || rawStatus === LessonStatus.Pending) && (
                            <div className="lesson-actions">
                                <button 
                                    className="btn-success" 
                                    onClick={() => handleStatusChange(id, LessonStatus.Confirmed)} 
                                >
                                    Potwierdź
                                </button>
                                <button 
                                    className="btn-danger" 
                                    onClick={() => handleStatusChange(id, LessonStatus.Cancelled)} 
                                >
                                    Odrzuć
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TutorDashboard;