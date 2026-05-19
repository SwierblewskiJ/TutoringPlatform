import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { fetchData } from "../services/ApiService";
import type { TutoringAd } from "../types/TutoringAds";
import Spinner from "../components/Spinner";

const AdDetails = () => {
    const {id} = useParams();
    const {isAuthenticated} = useAuth();
    const [ad, setAd] = useState<TutoringAd | null>(null);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        fetchData<TutoringAd>(`/Ads/${id}`).then(setAd);
    }, [id])

    if (!ad) return <Spinner text="Pobieranie ofert..."/>;

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
                    <div className="booking-form">
                        <label>Wybierz termin:</label>
                        <input 
                            type="datetime-local" 
                            className="form-input"
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <button 
                            className="btn-primary" 
                            // onClick={handleBooking}
                            disabled={!selectedDate}
                        >
                            Zarezerwuj lekcję
                        </button>
                    </div>
                ) : (
                    <div className="auth-prompt">
                        <p>Zaloguj się, aby zarezerwować termin.</p>
                        <Link to="/login" className="btn-secondary">Logowanie</Link>
                    </div>
                )}

            </aside>
        </div>
    );

};

export default AdDetails;