import { LessonStatus, type Lesson } from "../types/TutoringAds";

import { FaHourglassHalf } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { IoMdDoneAll } from "react-icons/io";



interface StudentDashboardProps {
    lessons: Lesson[];
}

const StudentDashboard = ({ lessons }: StudentDashboardProps) => {
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

                const datePart = startTime.split("T")[0]; 
                const [year, month, day] = datePart.split("-").map(Number);

                const timePart = startTime.split("T")[1].slice(0, 5); 

                const formattedDate = `${day} ${new Date(year, month - 1, day).toLocaleString("pl-PL", { month: "long" })} ${year} ${timePart}`;

                return (
                    <div key={id} className="lesson-card">
                        <div className="lesson-info">
                            <div className="lesson-header-row">
                                <h4>{adTitle}</h4>
                                {renderStatusBadge(rawStatus)}
                            </div>
                            
                            <p>Prowadzący: <strong>{tutorName}</strong></p>
                            <p>Termin: <span className="time-text">{formattedDate}</span></p>
                            
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