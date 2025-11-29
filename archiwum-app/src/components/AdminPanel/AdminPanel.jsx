import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminPanel.css'

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        imie: "",
        nazwisko: "",
        email: "",
        rola: "",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteEmail, setDeleteEmail] = useState(null);

    const navigate = useNavigate();

    const fetchUserData = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/');
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/me", {
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Unauthorized");

            const data = await res.json();
            setUser(data);

            if (data.rola !== 'admin') {
                navigate('/app');
            }
        } catch (err) {
            console.error(err);
            navigate('/');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8080/api/pracownicy", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError("Nie udało się pobrać użytkowników");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError(null);
        const capitalizedForm = {
            ...formData,
            imie: capitalize(formData.imie),
            nazwisko: capitalize(formData.nazwisko)
        };
        try {
            const res = await fetch("http://localhost:8080/api/pracownicy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(capitalizedForm),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg || "Błąd podczas dodawania");
            }
            setMessage(`Utworzono ${capitalizedForm.imie} ${capitalizedForm.nazwisko} | hasło tymczasowe to: ${data.wygenerowane_haslo}`);
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const confirmDelete = (id, email) => {
        if (email === "ac.admin@gmail.com" || email === user?.email) {
            alert("Nie można usunąć tego konta.");
            return;
        }
        setDeleteId(id);
        setDeleteEmail(email);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setDeleteId(null);
        setDeleteEmail(null);
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/pracownicy/${deleteId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            if (!res.ok) throw new Error("Błąd podczas usuwania");
            fetchUsers();
            closeModal();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="admin-panel">
            <h1>Panel Administratora</h1>
            {error && <p style={{ color: "red" }}>Błąd: {error}</p>}
            <div>
                <h3>Dodaj nowego użytkownika</h3>
                <div className="green-txt">{message}</div>
                <form onSubmit={handleAddUser} style={{ marginTop: 20 }}>
                    <input type="text" name="imie" placeholder="Imię" value={formData.imie} onChange={handleChange} required />
                    <br />
                    <input type="text" name="nazwisko" placeholder="Nazwisko" value={formData.nazwisko} onChange={handleChange} required />
                    <br />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <br />
                    <select name="rola" value={formData.rola} onChange={handleChange} required>
                        <option value="">Rola</option>
                        <option value="pracownik">Pracownik</option>
                        <option value="admin">Admin</option>
                    </select>
                    <br />
                    <button type="submit">Dodaj użytkownika</button>
                </form>
            </div>

            {loading ? (
                <p>Ładowanie użytkowników...</p>
            ) : (
                <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th className="random-column">ID</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Email</th>
                            <th className="random-column">Rola</th>
                        </tr>
                    </thead>
                    <tbody title="Kliknij aby usunąć...">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>Brak użytkowników</td>
                            </tr>
                        ) : (
                            users.map(({ id, imie, nazwisko, email, rola }) => (
                                <tr key={id} onClick={() => confirmDelete(id, email)}>
                                    <td>{id}</td>
                                    <td>{imie}</td>
                                    <td>{nazwisko}</td>
                                    <td>{email}</td>
                                    <td>{rola}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="action">
                    <div className="dialog-delete">
                        <p>Czy na pewno chcesz <b>usunąć</b> użytkownika: <br /> <i>{deleteEmail}</i>?</p>
                        <div className="del-buttons-row">
                            <button onClick={handleDelete}>Tak</button>
                            <button onClick={closeModal}>Nie</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminPanel;
