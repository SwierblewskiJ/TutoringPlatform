import { LessonStatus, type Lesson } from "../types/TutoringAds";

import { FaHourglassHalf } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { IoMdDoneAll } from "react-icons/io";
import { useState } from "react";
import { fetchData } from "../services/ApiService";
import toast from "react-hot-toast";
import "../styles/myProfile.css"



interface StudentDashboardProps {
    lessons: Lesson[];
    onRefresh: () => Promise<void>;
}

const StudentDashboard = ({ lessons, onRefresh }: StudentDashboardProps) => {
    const [isCancelling, setIsCancelling] = useState<number | null>(null);

    const handleCancel = async (lessonId: number) => {
        if (!window.confirm("Czy na pewno chcesz odwołać te zajęcia?")) return;

        try {
            setIsCancelling(lessonId);
            await fetchData(`/Lessons/${lessonId}/cancel`, {
                method: "PATCH"
            });

            toast.success("Pomyślnie odwołano lekcję.");
            await onRefresh(); 
        } catch (err) {
            console.error("Błąd podczas odwoływania zajęć:", err);
        } finally {
            setIsCancelling(null);
        }
    };

    if (lessons.length === 0) {
        return <p className="no-data">Nie masz jeszcze zaplanowanych lekcji.</p>;
    }

    const renderStatusBadge = (status: LessonStatus | string) => {
        switch (status) {
            case LessonStatus.Pending:
            case "Pending":
                return <span className="status-badge status-pending"><FaHourglassHalf /> Oczekiwanie</span>;
            case LessonStatus.Confirmed:
            case "Confirmed":
                return <span className="status-badge status-confirmed"><GiConfirmed /> Potwierdzono</span>;
            case LessonStatus.Cancelled:
            case "Cancelled":
                return <span className="status-badge status-cancelled"><MdCancel /> Anulowano</span>;
            case LessonStatus.Completed:
            case "Completed":
                return <span className="status-badge status-completed"><IoMdDoneAll /> Ukończono</span>;
            default:
                return <span className="status-badge status-default">{status}</span>;
        }
    };

    const sortedLessons = [...lessons].sort((a, b) => {
                    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
                });

    return (
        <div className="lessons-list">
            {sortedLessons.map((lesson: any) => {
                const id = lesson.id;
                const adTitle = lesson.adTitle || "Lekcja";
                const tutorName = lesson.relatedUser || "Korepetytor";
                const startTime = lesson.startTime;
                const isRecurring = lesson.isRecurring;
                const remainingLessons = lesson.remainingLessons;
                const rawStatus = lesson.status;

                const dateObj = new Date(startTime);
                const formattedDate = dateObj.toLocaleString("pl-PL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                });
                return (
                    <div key={id} className="lesson-card">
                        <div className="lesson-info">
                            <div className="lesson-header-row">
                                <h4>{adTitle}</h4>
                            </div>
                            <p>Prowadzący: <strong>{tutorName}</strong></p>
                            <p>Termin: <span className="time-text">{formattedDate}</span></p>
                        </div> 

                        <div className="lesson-actions-wrapper">
                            <div className="lesson-actions">
                                {renderStatusBadge(rawStatus)}
                                
                                {lesson.status !== "Cancelled" && (
                                    <button
                                        className="btn-danger-sm"
                                        disabled={isCancelling === lesson.id}
                                        onClick={() => handleCancel(lesson.id)}
                                    >
                                        {isCancelling === lesson.id ? "Odwoływanie..." : "Anuluj rezerwację"}
                                    </button>
                                )}
                            </div>
                        
                            {isRecurring && (
                                <span className="recurring-badge">
                                    Cykliczne (Pozostało lekcji: {remainingLessons})
                                </span>
                            )}
                        </div>         
                    </div>
                );
            })}
        </div>
    );
};

export default StudentDashboard;