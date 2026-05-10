import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { fetchData } from "../services/ApiService";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student' 
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchData<string>('/Auth/register', {
            method: 'POST',
            body: formData
            });
      navigate('/login'); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Stwórz konto</h2>
        <p className="auth-subtitle">Dołącz do społeczności kredkorepetycje</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Imię i Nazwisko</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Rola</label>
            <select 
              className="form-input" 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Student">Student (szukam pomocy)</option>
              <option value="Tutor">Tutor (chcę uczyć)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Hasło</label>
            <input 
              type="password" 
              className="form-input" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary auth-button">Zarejestruj się</button>
        </form>

        <div className="auth-footer">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;