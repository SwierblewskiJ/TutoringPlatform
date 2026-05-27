import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Lesson, TutoringAd, UserProfile } from "../types/TutoringAds";
import { fetchData } from "../services/ApiService";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import "../styles/myProfile.css";

import { PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import StudentDashboard from "../components/StudentDashboard";
import TutorDashboard from "../components/TutorDashboard";
import TutorAvailabilityManager from "../components/TutorAvailabilityManager";


const MyProfile = () => {
    const { user,isInitialLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [myAds, setMyAds] = useState<TutoringAd[]>([]); 
    const [loading, setLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAdId, setSelectedAdId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState<number>(0);
    const [editIsOnline, setEditIsOnline] = useState<boolean>(true);
    const [editIsAvailable, setEditIsAvailable] = useState<boolean>(true);

    const loadDashboardData = async () => {
        try{
            setLoading(true);
            const profileData = await fetchData<UserProfile>("/me");
            setProfile(profileData);

            const lessonsData = await fetchData<Lesson[]>("/Lessons/my");
            setLessons(lessonsData);

            if (profileData.role === "Tutor") {
                const allAds = await fetchData<TutoringAd[]>("/Ads");
                const tutorAds = allAds.filter(ad => ad.tutorName === profileData.name); 
                setMyAds(tutorAds);
            }

        } catch(err){
            toast.error("Błąd ładowania danych profilu")
        } finally{
            setLoading(false);
        }
    };

    const openEditModal = (ad: any) => {
        setSelectedAdId(ad.id);
        setEditTitle(ad.title);
        setEditDescription(ad.description || "");
        setEditPrice(ad.price || 0);
        setEditIsOnline(ad.isOnline ?? true);
        setEditIsAvailable(ad.isAvailable ?? true);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAdId) return;

        try {
            await fetchData(`/Ads/${selectedAdId}`, {
                method: "PUT",
                body: {
                    title: editTitle,
                    description: editDescription,
                    price: editPrice,
                    isOnline: editIsOnline,
                    isAvailable: editIsAvailable
                }
            });

            toast.success("Pomyślnie zaktualizowano ogłoszenie!");
            setIsEditModalOpen(false);
            loadDashboardData(); 
        } catch (err) {
            console.error("Błąd edycji:", err);
        }
    };

    useEffect(() => {
        if (isInitialLoading) return;

        if (!user) return;

        loadDashboardData();
    
    },[isInitialLoading,user]);

    if(isInitialLoading || loading) return <Spinner text="Ładowanie profilu..."/>
    if(!profile) return <p className="no-data">Nie udało się załadować danych profilu.</p>

    return(
        <div className="dashboard-layout">
            <header className="profile-card">
                <div className="profile-avatar">
                    {profile.role == "Tutor" ? <FaChalkboardTeacher /> : <PiStudent />} 
                </div>
                <div className="profile-details">
                    <h2>{profile.name}</h2>
                    <p className="profile-email">{profile.email}</p>
                    <span className={`role-tag ${profile.role.toLowerCase()}`}>
                        {profile.role === "Tutor" ? "Korepetytor" : "Uczeń"}
                    </span>
                </div>
            </header>

            {profile.role === "Tutor" && (
                <section className="dashboard-section">
                    <div className="section-header">
                        <h3>Twoje Ogłoszenia i Dostępność</h3>
                        <p>Zadeklaruj dni i godziny, w których jesteś wolny dla każdego ogłoszenia.</p>
                    </div>
                    <div className="my-ads-list">
                        {myAds.length === 0 ? (
                            <p className="no-data">Nie dodałeś jeszcze żadnego ogłoszenia.</p>
                        ) : (
                            myAds.map(ad => (
                                <div key={ad.id} className="ad-card-backend">
                                    <div className="lesson-header-row" style={{ marginBottom: "1.2rem", alignItems: "center" }}>
                                        <h4 style={{ margin: 0 }}>{ad.title}</h4>
                                        <button 
                                            className="btn-primary-sm" 
                                            onClick={() => openEditModal(ad)}
                                        >
                                            Edytuj treść
                                        </button>
                                    </div>

                                    <TutorAvailabilityManager adId={ad.id} />
                                </div>
                            ))
                        )}
                    </div>
                </section>
            )}

              <main className="dashboard-content">
                <div className="section-header">
                    <h3>Twój Terminarz Zajęć</h3>
                    <p>Zarządzaj swoimi nadchodzącymi i przeszłymi zajęciami.</p>
                </div>

                {profile.role === 'Tutor' ? (
                    <TutorDashboard lessons={lessons} onRefresh={loadDashboardData}/>
                ) : (
                    <StudentDashboard lessons={lessons} onRefresh={loadDashboardData}/>
                )}
            </main>

            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Edycja ogłoszenia</h3>
                        <form onSubmit={handleEditSubmit}>
                            <label>Tytuł ogłoszenia:</label>
                            <input
                                type="text"
                                className="form-input"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                required
                            />

                            <label>Opis / Zakres materiału:</label>
                            <textarea
                                className="form-input"
                                rows={4}
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                required
                            />

                            <label>Cena (zł/h):</label>
                            <input
                                type="number"
                                className="form-input"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                required
                            />

                            <div className="checkbox-row" style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                    <input 
                                        type="checkbox" 
                                        checked={editIsOnline}
                                        onChange={(e) => setEditIsOnline(e.target.checked)}
                                    />
                                    Lekcje Online
                                </label>

                                
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Anuluj
                                </button>
                                <button type="submit" className="btn-success">
                                    Zapisz zmiany
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default MyProfile;