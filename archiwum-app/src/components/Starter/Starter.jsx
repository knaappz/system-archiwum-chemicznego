import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Starter.css";

const Starter = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleEmployeeLogin = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, haslo: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.msg);
            } else {
                localStorage.setItem('userRole', data.user.rola);
                localStorage.setItem('userData', JSON.stringify(data.user));
                navigate('/app');
            }

        } catch (err) {
            setError("Błąd połączenia z serwerem");
            console.error(err);
        }
    };

    const handleGuestEnter = () => {
        localStorage.setItem('userRole', 'gosc');
        navigate('/app/view-all-data');
    };

    return (
        <section className='starter-page'>
            <div className='title'>
                <h2>Archiwum chemiczne</h2>
            </div>
            <div className='lefty'>
                <h3>Zaloguj się:</h3>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <p>Zresetuj hasło. <i>'klick'</i></p>

                <br />
                <button onClick={handleEmployeeLogin}>Zaloguj</button>
                {error && <p className="error">{error}</p>}
            </div>

            <div className='righty'>
                <h3>Wejście jako gość</h3>
                <button onClick={handleGuestEnter}>Wejdź do aplikacji</button>
            </div>
        </section>
    );
};

export default Starter;
