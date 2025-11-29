import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import "./Layout.css";

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');

        if (!storedRole) {
            navigate('/');
        } else {
            setRole(storedRole);

            if (storedRole === 'gosc' && location.pathname !== '/app/view-all-data') {
                navigate('/app/view-all-data');
            }
        }
    }, [navigate, location.pathname]);

    useEffect(() => {
        if (role && location.pathname === '/') {
            navigate('/app');
        }
    }, [role, location.pathname, navigate]);

    const handleLogOut = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        setRole(null);
        navigate('/');
    };

    const handleAdminPanel = () => {
        navigate('/app/admin')
    }

    const user = JSON.parse(localStorage.getItem('userData'));

    return (
        <>
            <section className='header'>
                {/* Linki dostępne tylko dla pracownika */}
                {(role === 'pracownik' || role === 'admin') && (
                    <>
                        <div className="archive-menu">
                            <Link className="home-btn" to="/app">
                                <img src="/assets/icons/sample.png" alt="noimg" />
                                <p>Archiwum</p>
                            </Link>

                            <div className="submenu">
                                <Link to="/app/knowledge">Baza wiedzy</Link>
                                <Link to="/app/analitics">Panel analityczny</Link>
                                <Link to="/app/standards">Normy</Link>
                                {/* <Link to="/change-pswrd">Reset hasła</Link> */}
                            </div>
                        </div>


                        <Link to="/app/add-data">Dodaj pozycje</Link>
                    </>
                )}


                {/* Widoczny dla wszystkich */}
                <Link to="/app/view-all-data">Wszystkie próbki</Link>

                {(role === 'pracownik' || role === 'admin') && (
                    <>
                        <Link to="/app/view-all-for-disposal">Utylizacja</Link>
                        <Link to="/app/dictionary">Słownik</Link>
                        <Link to="/app/order-register">Rejestr zleceń</Link>
                    </>
                )}


                <div className='logout'>

                    <p>
                        {role === 'pracownik' ? (
                            `${(user.email?.split('@')[0]) || 'Pracownik'}`
                        ) : role === 'gosc' ? (
                            'Zalogowano jako: Gość'
                        ) : role === 'admin' ? (
                            `${(user.email?.split('@')[0]) || ''}`
                        ) : null}
                    </p>


                    <button onClick={handleLogOut} className="logout-btn">Wyloguj</button>
                </div>

                {/* Jeśli rola === admin, ukazuje się przycisk do panelu administratora */}

                {role === 'admin' && (
                    <div className="admin-panel-btn">
                        <button onClick={handleAdminPanel}>Panel Admina</button>
                    </div>
                )}
            </section>

            <section id='main-app'>
                <Outlet />
            </section>
        </>
    );
};

export default Layout;
