import './Home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Pobieranie użytkownika
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        fetch("http://localhost:8080/api/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => setUser(data))
            .catch((err) => console.error("Błąd pobierania użytkownika:", err));
    }, []);

    // Funkcja imienia
    const getDisplayName = () => {
        const name = user?.imie
            ? user.imie
            : user?.email
                ? user.email.split('@')[0]
                : 'nieznany';

        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    // Funkcja nawigacji
    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <section className="home-page">
            <h1 className='hello-user'>Dzień dobry, {getDisplayName()}!</h1>
            <div className='home-container'>
                <div className='two-sides'>
                    <button
                        onClick={() => handleNavigate('/app/analitics')}>
                        Panel analityczny
                    </button>
                    <button
                        onClick={() => handleNavigate('/app/standards')}>
                        Standardy <br /> przechowywania
                    </button>
                    <button
                        onClick={() => handleNavigate('/app/knowledge')}>Baza wiedzy
                    </button>
                    <button
                        onClick={() => handleNavigate('/change-pswrd')}>Problemy techniczne <br />lub zmiana hasła?
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Home;
