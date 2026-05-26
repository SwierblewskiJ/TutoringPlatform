import { useEffect, useState } from "react";
import { fetchData } from "../services/ApiService";
import toast from "react-hot-toast";
import type { TutorAvailability } from "../types/TutorAvailability";

const TutorAvailabilityManager = ({ adId }: { adId: number }) => {
    const [availabilities, setAvailabilities] = useState<TutorAvailability[]>([]);
    const [dayOfWeek, setDayOfWeek] = useState<number>(1);
    const [startTime, setStartTime] = useState<string>("16:00");
    const [endTime, setEndTime] = useState<string>("17:00");
    const [loading,setLoading] = useState(false);

    const loadAvailabilities = async () => {
        try {
            const data = await fetchData<TutorAvailability[]>(`/TutorAvailabilities/ad/${adId}`); 
            setAvailabilities(data);
        }catch (err) {
            console.error("Błąd pobierania godzin dostępności", err);
        }
    }


    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);

        const startTotalMinutes = startH * 60 + startM;
        const endTotalMinutes = endH * 60 + endM;

        const minDuration = 45; 
        if (endTotalMinutes - startTotalMinutes < minDuration) {
            toast.error(`Zajęcia muszą trwać co najmniej ${minDuration} minut!`);
            return;
        }

        const maxDuration = 3*60;
        if(endTotalMinutes - startTotalMinutes > maxDuration){
            toast.error(`Zajęcia mogą trwać maksymalnie ${maxDuration} minut!`);
            return;
        }

        setLoading(true);


        const body = {
            dayOfWeek: Number(dayOfWeek),
            startTime: `${startTime}:00`, 
            endTime: `${endTime}:00`
        };

        try {
            await fetchData(`/TutorAvailabilities/ad/${adId}`, {
                method: "POST",
                body: body
            });
            toast.success("Dodano termin!");
            loadAvailabilities(); 
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    
    const handleDelete = async (id: number) => {
        try {
            await fetchData(`/TutorAvailabilities/${id}`, { method: "DELETE" });
            toast.success("Usunięto termin");
            loadAvailabilities(); 
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        loadAvailabilities();
    }, [adId])

    const daysMap: Record<string | number, string> = {
        "1": "Poniedziałek",
        "2": "Wtorek",
        "3": "Środa",
        "4": "Czwartek",
        "5": "Piątek",
        "6": "Sobota",
        "0": "Niedziela",

        "Monday": "Poniedziałek",
        "Tuesday": "Wtorek",
        "Wednesday": "Środa",
        "Thursday": "Czwartek",
        "Friday": "Piątek",
        "Saturday": "Sobota",
        "Sunday": "Niedziela"
    };
    return (
       <div className="availability-manager-box">
            <form onSubmit={handleAdd} className="availability-mini-form">
                <div className="form-row">
                    <select 
                        className="form-input" 
                        value={dayOfWeek} 
                        onChange={(e) => setDayOfWeek(Number(e.target.value))} 
                    >
                        <option value={1}>Poniedziałek</option>
                        <option value={2}>Wtorek</option>
                        <option value={3}>Środa</option>
                        <option value={4}>Czwartek</option>
                        <option value={5}>Piątek</option>
                        <option value={6}>Sobota</option>
                        <option value={0}>Niedziela</option>
                    </select>
                    <input type="time" className="form-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                    <input type="time" className="form-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                    <button type="submit" className="btn-primary-sm" disabled={loading}>
                        {loading ? "..." : "Dodaj"}
                    </button>
                </div>
            </form>

            <div className="declared-hours-list">
                <h5>Aktywne terminy:</h5>
                {availabilities.length === 0 ? (
                    <p className="no-hours-text">Brak zdefiniowanych godzin. Uczeń nie może zarezerwować zajęć!</p>
                ) : (
                    <div className="hours-badges-grid">
                        {availabilities.map((av) => (
                            <div key={av.id} className="hour-badge">
                                <span>{daysMap[av.dayOfWeek] || av.dayOfWeek}: {av.startTime.slice(0, 5)} - {av.endTime.slice(0, 5)}</span>
                                <button type="button" className="btn-delete-hour" onClick={() => handleDelete(av.id)}>×</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
       </div>
    );
}
export default TutorAvailabilityManager;