import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Lesson, UserProfile } from "../types/TutoringAds";
import { fetchData } from "../services/ApiService";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import "../styles/myProfile.css";

import { PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import StudentDashboard from "../components/StudentDashboard";
import TutorDashboard from "../components/TutorDashboard";


const MyProfile = () => {
    const { isInitialLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    const loadDashboardData = async () => {
        try{
            setLoading(true);
            const profileData = await fetchData<UserProfile>("/me");
            setProfile(profileData);

            // const lessonsData = await fetchData<Lesson[]>("/Lessons");
        } catch(err){
            toast.error("Błąd ładowania danych profilu")
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        if(!isInitialLoading){
            loadDashboardData();
        }
    },[isInitialLoading]);

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

              <main className="dashboard-content">
                <div className="section-header">
                    <h3>Twój Terminarz Zajęć</h3>
                    <p>Zarządzaj swoimi nadchodzącymi i przeszłymi zajęciami.</p>
                </div>

                {profile.role === 'Tutor' ? (
                    <TutorDashboard lessons={lessons} onRefresh={loadDashboardData}/>
                ) : (
                    <StudentDashboard lessons={lessons}/>
                )}
            </main>
        </div>
    );
    
};

export default MyProfile;