import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { fetchData } from "../services/ApiService";
import type { TutoringAd } from "../types/TutoringAds";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

const AdDetails = () => {
    const {id} = useParams();
    const {isAuthenticated} = useAuth();
    const [ad, setAd] = useState<TutoringAd | null>(null);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        fetchData<TutoringAd>(`/Ads/${id}`).then(setAd);
    }, [id])

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(!value) return;

        const selected = new Date(value);
        const hours = selected.getHours();
        const minutes = selected.getMinutes();
        const day = selected.getDay();

        let date = new Date();
        let currentHour = date.getHours();
        let currentMinute = date.getMinutes();
        let currentDay = date.getDay();
        

        if(hours < 8 || hours >= 22){
            toast.error("Korepetycje są dostępne tylko w godzinach 08:00 - 22:00!");
            setSelectedDate("");
            e.target.value = "";
            return;
        } else if (hours == currentHour){
            if(minutes < currentMinute){
                toast.error("Nie rezerwuj terminów z przeszłości!");
                setSelectedDate("");
                e.target.value = "";
                return;
            }
            
        } else if(hours < currentHour && (currentDay <= day)){
            toast.error("Nie rezerwuj terminów z przeszłości!");
            setSelectedDate("");
            e.target.value = "";
            return; 
        }


        setSelectedDate(value);
    };

    const getMinDate = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    };

    if (!ad) return <Spinner text="Pobieranie oferty..."/>;

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
                            onChange={handleDataChange}
                            min={getMinDate()}
                        />
                        <p>
                            Sprawdź dzień i godzinę,
                            <br />dostępność wyznacza prowadzący, 
                            <br />obowiązuje zakres wyboru od 8:00 do 22:00 z co najmniej 3 godiznnym wyprzedzeniem przez cały tydzień 
                        </p>
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