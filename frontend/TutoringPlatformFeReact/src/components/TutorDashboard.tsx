import { LessonStatus, type Lesson } from "../types/TutoringAds";
import { fetchData } from "../services/ApiService";
import toast from "react-hot-toast";

import { FaHourglassHalf } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { IoMdDoneAll } from "react-icons/io";
import { useEffect, useState } from "react";

import "../styles/myProfile.css"


interface TutorDashboardProps {
    lessons: Lesson[];
    onRefresh: () => void;
}

const TutorDashboard = ({ lessons: initialLessons,  onRefresh }: TutorDashboardProps) => {
    const [localLessons, setLocalLessons] = useState<Lesson[]>(initialLessons);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);

    useEffect(() => {
        setLocalLessons(initialLessons);
    }, [initialLessons]);
    
    const handleStatusChange = async (lessonId: number, newStatusValue: number, confirmMessage?: string) => {
        if (confirmMessage && !window.confirm(confirmMessage)) return;
    try {
        setIsUpdating(lessonId)

        setLocalLessons(prev => 
            prev.map(lesson => 
                lesson.id === lessonId 
                    ? { ...lesson, status: newStatusValue as any } 
                    : lesson
            )
        );

        await fetchData(`/Lessons/${lessonId}/status`, {
            method: "PATCH",
            body: { status: newStatusValue }
        });

       if (newStatusValue === LessonStatus.Confirmed) {
            toast.success("Zaakceptowano lekcję!");
        } else if (newStatusValue === LessonStatus.Cancelled) {
            toast.success("Zajęcia zostały odwołane/odrzucone.");
        } else {
            toast.success("Zaktualizowano status lekcji.");
        }
        
        onRefresh(); 
    } catch (error) {
        console.error("Błąd podczas zmiany statusu lekcji:", error);
        toast.error("Nie udało się zmienić statusu zajęć.");
        setLocalLessons(initialLessons);
    } finally {
        setIsUpdating(null);
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

               const dateObj = new Date(startTime);
                const formattedDate = dateObj.toLocaleString("pl-PL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                });

                const isPending = rawStatus === "Pending" || rawStatus === LessonStatus.Pending;
                const isConfirmed = rawStatus === "Confirmed" || rawStatus === LessonStatus.Confirmed;

                return (
                    <div key={id} className="lesson-card">
                        
                        <div className="lesson-info">
                            <div className="lesson-header-row">
                                <h4>{adTitle}</h4>
                            </div>
                            <p>Uczeń: <strong>{studentName}</strong></p>
                            <p>Termin: <span className="time-text">{formattedDate}</span></p>
                        </div>

                        <div className="lesson-actions-wrapper">
                            <div className="lesson-actions">
                                {renderStatusBadge(rawStatus)}
                                
                                {isPending && (
                                    <>
                                        <button 
                                            className="btn-success" 
                                            disabled={isUpdating === id}
                                            onClick={() => handleStatusChange(id, LessonStatus.Confirmed)} 
                                        >
                                            Potwierdź
                                        </button>
                                        <button 
                                            className="btn-danger-sm" 
                                            disabled={isUpdating === id}
                                            onClick={() => handleStatusChange(id, LessonStatus.Cancelled)} 
                                        >
                                            Odrzuć
                                        </button>
                                    </>
                                )}

                                {isConfirmed && (
                                    <button
                                        className="btn-danger-sm"
                                        disabled={isUpdating === id}
                                        onClick={() => handleStatusChange(id, LessonStatus.Cancelled, "Czy jako korepetytor chcesz odwołać te zajęcia?")}
                                    >
                                        {isUpdating === id ? "Odwoływanie..." : "Odwołaj lekcję"}
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

export default TutorDashboard;