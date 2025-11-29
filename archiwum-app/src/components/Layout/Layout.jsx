import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import "./Layout.css";

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem('authToken');

        // Gdy jesteśmy goścmi dostajemy tymczasową role "gosc".
        if (!token) {
            const guestRole = localStorage.getItem('userRole');
            if (guestRole === 'gosc') {
                setRole('gosc');
                return;
            }
            navigate('/');
            return;
        }

        // Jeśli jesteśmy pracownikiem, adminem to dokonuje się autoryzacja.
        try {
            const res = await fetch("http://localhost:8080/api/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Unauthorized");
            }

            const data = await res.json();
            setUser(data);
            setRole(data.rola);
        } catch (err) {
            console.error("Błąd autoryzacji", err);
            localStorage.removeItem('authToken');
            navigate('/');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (role === 'gosc' && location.pathname !== '/app/view-all-data-guest') {
            navigate('/app/view-all-data-guest');
        }
    }, [role, location.pathname, navigate]);

    // Tymczasowo zostanie stary logout
    // const handleLogOut = () => {
    //     localStorage.removeItem('authToken');
    //     localStorage.removeItem('userRole');
    //     setRole(null);
    //     navigate('/');
    // };

    const handleLogOut = async () => {
        const token = localStorage.getItem('authToken');

        if (token) {
            try {
                await fetch("http://localhost:8080/api/logout", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
            } catch (err) {
                console.error("Błąd podczas wylogowania", err);
            }
        }

        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const handleAdminPanel = () => {
        navigate('/app/admin')
    };

    return (
        <section>
            <section id='header'>
                {(role === 'pracownik' || role === 'admin') && (
                    <>
                        <div className="archive-menu">
                            <Link className="home-btn" to="/app">
                                <img src="/assets/icons/sample.png" alt="noimg" />
                                <p>Archiwum	</p>
                            </Link>
                        </div>
                        <Link to="/app/add-data">Dodaj pozycje</Link>
                    </>
                )}

                <Link to="/app/view-all-data">Wszystkie próbki</Link>

                {(role === 'pracownik' || role === 'admin') && (
                    <>
                        <Link to="/app/view-all-for-disposal">Utylizacja</Link>
                        <Link to="/app/dictionary">Słownik</Link>
                        <Link to="/app/order-register">Rejestr zleceń</Link>
                    </>
                )}

                <div className='logout'>
                    <>
                        {role === 'gosc'
                            ? 'Zalogowano jako: Gość'
                            : user?.email?.split('@')[0] || ''}
                    </>
                    <button onClick={handleLogOut} className="logout-btn">Wyloguj</button>
                </div>

                {role === 'admin' && (
                    <div className="admin-panel-btn">
                        <button onClick={handleAdminPanel}>Panel Admina</button>
                    </div>
                )}
            </section>

            <section id='main-app'>
                <Outlet />
            </section>
        </section>
    );
};

export default Layout;
