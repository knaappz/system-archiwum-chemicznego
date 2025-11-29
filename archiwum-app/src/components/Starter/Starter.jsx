import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Starter.css";

const Starter = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [mustChangePassword, setMustChangePassword] = useState(false);
    const [userId, setUserId] = useState(null);
    const [newPassword, setNewPassword] = useState('');

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
            } else if (data.mustChangePassword) {
                setMustChangePassword(true);
                setUserId(data.user.id);
                setEmail(data.user.email);
                setError(null);
            } else {
                localStorage.setItem('authToken', data.token);
                navigate('/app');
            }

        } catch (err) {
            setError("Błąd połączenia z serwerem");
            console.error(err);
        }
    };

    const handleGuestEnter = () => {
        localStorage.removeItem('authToken');
        localStorage.setItem('userRole', 'gosc');
        navigate('/app/view-all-data-guest');
    };

    const handlePasswordChange = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.msg || "Nie udało się zmienić hasła");
            } else {
                setError(null);
                alert("Hasło zmienione. Możesz się teraz zalogować.");
                setMustChangePassword(false);
                setPassword('');
                setNewPassword('');
            }

        } catch (err) {
            setError("Błąd połączenia z serwerem");
            console.error(err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            navigate('/app');
        }
    }, []);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role === 'gosc') {
            navigate('/app/view-all-data-guest');
        }
    }, [navigate]);

    return (
        <section className='starter-page'>
            <div className='title'>
                <h2>Archiwum chemiczne</h2>
            </div>

            <div className='center-div'>
                <div className='login-group'>
                    {mustChangePassword ? (
                        <div className='group-div'>
                            <h3>Ustaw nowe hasło:</h3>
                            <p>Email: <b>{email}</b></p>
                            <input
                                type="password"
                                placeholder="Nowe hasło"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <br />
                            <button onClick={handlePasswordChange}>Zmień hasło</button>
                            {error && <p className="error">{error}</p>}

                        </div>
                    ) : (
                        <div className='group-div'>
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

                            <Link to='/change-pswrd'>Reset hasła...</Link>

                            <br />
                            <button onClick={handleEmployeeLogin}>Zaloguj</button>
                            {error && <p className="error">{error}</p>}

                        </div>
                    )}

                    <div className='guest-div'>
                        <h2>lub</h2>
                        <div>
                            <h3>Wejdź jako gość</h3>
                            <button onClick={handleGuestEnter}>Wejdź do aplikacji</button>
                        </div></div>
                </div>

                <div className='chemistry-img'></div>

            </div>
        </section>
    );
};

export default Starter;
