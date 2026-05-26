import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { fetchData } from "../services/ApiService";
import type { TutoringAd } from "../types/TutoringAds";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import type { TutorAvailability } from "../types/TutorAvailability";

const AdDetails = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [ad, setAd] = useState<TutoringAd | null>(null);
    const [availabilities, setAvailabilities] = useState<TutorAvailability[]>([]);

    const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [isSubmitting, setIsSubmitting] =useState<boolean>(false); 
    const [isRecurring, setIsRecurring] = useState<boolean>(false);
    const [weekCount, setWeekCount] = useState<number>(4);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [adData, availabilityData] = await Promise.all([
                    fetchData<TutoringAd>(`/Ads/${id}`),
                    fetchData<TutorAvailability[]>(`/TutorAvailabilities/ad/${id}`)
                ]);

                setAd(adData);
                setAvailabilities(availabilityData);
            } catch (error) {
                toast.error("Błąd ładowania danych ogłoszenia");
            }
        };
        loadData();
    }, [id]);

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAvailabilityId || !selectedDate) return;

        setIsSubmitting(true);

        try {
            const selectedAv = availabilities.find(av => av.id === selectedAvailabilityId);
            if (!selectedAv) return;

            const fullDateTimeString = `${selectedDate}T${selectedAv.startTime}`;

        const response = await fetchData<any>("/Lessons/book", {
            method: "POST",
            body: {
                tutorAvailabilityId: selectedAvailabilityId,
                startDate: fullDateTimeString,
                isRecurring: isRecurring,
                packageCount: isRecurring ? weekCount : 1,
            }
        });

        if (response && response.message) {
            toast.success(response.message);
        }
        
        setSelectedAvailabilityId(null);
        setSelectedDate("");
        setIsRecurring(false);
    } catch (error) {
        console.error(error);
    }
        
};

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value;
        if (!dateValue || !selectedAvailabilityId) return;

        const selectedAv = availabilities.find(av => av.id === selectedAvailabilityId);
        if (!selectedAv) return;

        const [year, month, day] = dateValue.split("-").map(Number);
        const dateObj = new Date(year, month - 1, day);
        
        const chosenDayIndex = dateObj.getDay(); 

        const englishDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const polishDays = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];

        const backendDayStr = String(selectedAv.dayOfWeek).toLowerCase().trim();
        
        let backendDayIndex = englishDays.indexOf(backendDayStr);
        if (backendDayIndex === -1) {
            backendDayIndex = polishDays.indexOf(backendDayStr);
        }

        if (chosenDayIndex !== backendDayIndex) {
            toast.error('Wybierz ponownie poprawny dzień.');
            toast.error(`Wybrana data to ${polishDays[chosenDayIndex]}. Korepetytor udostępnia ten termin: ${polishDays[backendDayIndex] || selectedAv.dayOfWeek}!`);
            setSelectedDate("");
            e.target.value = ""; 
            return;
        }

        setSelectedDate(dateValue);
};

    const daysMap: Record<string, string> = {
        "Sunday": "Niedziela",
        "Monday": "Poniedziałek",
        "Tuesday": "Wtorek",
        "Wednesday": "Środa",
        "Thursday": "Czwartek",
        "Friday": "Piątek",
        "Saturday": "Sobota"
    };

    const today = new Date();
    const minDateLocal = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (!ad) return <Spinner text="Pobieranie oferty..." />;

    return (
        <div className="ad-details-layout">
            <section className="ad-main-content">
                <h1>{ad.title}</h1>
                <div className="ad-meta">
                    <span>{ad.isOnline ? "Online" : "Stacjonarnie"}</span>
                    <span>Korepetytor: {ad.tutorName}</span>
                </div>
                <hr />
                <p className="description">{ad.description}</p>
            </section>

            <aside className="booking-card">
                <div className="price-tag">{ad.price} zł <span>/ h</span></div>

                {isAuthenticated ? (
                    <form className="booking-form" onSubmit={handleBookingSubmit}>
                        <div className="form-group">
                            <label>Wybierz dzień tygodnia i godziny:</label>
                            <select 
                                required
                                className="form-input"
                                value={selectedAvailabilityId || ""}
                                onChange={(e) => setSelectedAvailabilityId(Number(e.target.value) || null)}
                            >
                                <option value="">-- Wybierz wolny termin --</option>
                                {availabilities.map((av) => (
                                    <option key={av.id} value={av.id}>
                                        {daysMap[av.dayOfWeek] || av.dayOfWeek} ({av.startTime.slice(0, 5)} - {av.endTime.slice(0, 5)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedAvailabilityId && (
                            <>
                            <div className="form-group">
                                <label>Wybierz dokładną datę zajęć:</label>
                                <input 
                                    type="date" 
                                    className="form-input"
                                    required
                                    value={selectedDate}
                                    min={minDateLocal} 
                                    onChange={handleDateChange}
                                />
                            </div>
                            <div className="form-group checkbox-container">
                            <label>
                                <input type="checkbox"
                                checked={isRecurring}
                                onChange={(e)=> setIsRecurring(e.target.checked)} 
                                />
                                Chcę uczęszczać na zajęcia cyklicznie co tydzień
                            </label>
                        </div>

                        {isRecurring && (
                            <div className="form-group">
                                <label>Przez ile tygodi (liczba lekcji):</label>
                                <select className="form-input"
                                value={weekCount} onChange={(e)=> setWeekCount(Number(e.target.value))}>
                                
                                <option value={2}>2 tygodnie (2 lekcje)</option>
                                <option value={4}>4 tygodnie (1 miesiąc)</option>
                                <option value={8}>8 tygodni (2 miesiące)</option>
                                <option value={12}>12 tygodni (3 miesiące)</option>

                                </select>
                            </div>
                        )}
                            </>
                            
                        )}

                        
                        

                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={!selectedAvailabilityId || !selectedDate || isSubmitting}
                        >
                            {isSubmitting ? "Rezerwacja..." : "Wyślij prośbę o rezerwację"}
                        </button>
                    </form>
                ) : (
                    <div className="auth-prompt">
                        <p>Zaloguj się jako student, aby zarezerwować te zajęcia.</p>
                        <Link to="/login" className="btn-secondary">Zaloguj się</Link>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default AdDetails;