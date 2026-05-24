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
            await fetchData("/Lessons/book", {
                method: "POST",
                body: {
                    tutorAvailabilityId: selectedAvailabilityId,
                    startDate: new Date(selectedDate).toISOString(),
                    isRecurring: false,
                    packageCount: 1 ,
                }
            });
            
            setSelectedAvailabilityId(null);
            setSelectedDate("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const daysMap = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];

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
                                        {daysMap[av.dayOfWeek]} ({av.startTime.slice(0, 5)} - {av.endTime.slice(0, 5)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedAvailabilityId && (
                            <div className="form-group">
                                <label>Wybierz dokładną datę zajęć:</label>
                                <input 
                                    type="date" 
                                    className="form-input"
                                    required
                                    value={selectedDate}
                                    min={new Date().toISOString().split("T")[0]} 
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
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