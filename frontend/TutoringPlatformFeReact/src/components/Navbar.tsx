import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () => {
        const { user, logout} = useAuth();
        return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <span className="logo-k">k</span>
                <span className="logo-text">redkorepetycje</span>
            </Link>

            {/* <div className="nav-center">
                 <Link to="/how-it-works" className="nav-link">Jak to działa?</Link>
            </div> */}

            <div className="nav-right">
                {user?.role === 'Tutor' && (
                    <Link to="/addAd">
                        <button className="btn-secondary">Dodaj ogłoszenie</button>
                    </Link>
                )}
                {user?.role === "Student" && (
                    <Link to="/me">
                        <button className="btn-secondary">Moje zajęcia</button>
                    </Link>
                )} 
                {!!user ? (
                    <>
                    <span className="user-name">Witaj, <Link to="/me">{user.name}!</Link></span>

                    <Link to="/me"><FaRegUserCircle size={25} color="#a0aec0" /> </Link>
                    
                    <Link to={'/'}>
                    <button onClick={logout} className="btn-secondary">
                        Wyloguj
                    </button>
                    </Link>
                    </>
                ) : <>
                    <Link to="/login" >
                        <button className="btn-secondary">Logowanie</button>
                    </Link>

                    <Link to="/register?role=Tutor">
                        <button className="btn-primary">Dołącz jako korepetytor</button>
                    </Link>
                </>}
            </div>
        </nav>
    );
}
export default Navbar;