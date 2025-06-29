import React, { useEffect, useState } from "react";
import './AdminPanel.css'

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        imie: "",
        nazwisko: "",
        email: "",
        haslo: "",
        rola: "pracownik",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8080/api/pracownicy");
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

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch("http://localhost:8080/api/pracownicy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || "Błąd podczas dodawania");
            }

            setFormData({
                imie: "",
                nazwisko: "",
                email: "",
                haslo: "",
                rola: "pracownik",
            });

            fetchUsers(); // odśwież listę
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        const confirm = window.confirm("Na pewno chcesz usunąć tego użytkownika?");
        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:8080/api/pracownicy/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Błąd podczas usuwania");

            fetchUsers(); // odśwież listę
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="admin-panel">
            <h2>Panel Administratora</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div>
                <h3>Dodaj nowego użytkownika</h3>
                <form onSubmit={handleAddUser} style={{ marginTop: 20 }}>
                    <input
                        type="text"
                        name="imie"
                        placeholder="Imię"
                        value={formData.imie}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <input
                        type="text"
                        name="nazwisko"
                        placeholder="Nazwisko"
                        value={formData.nazwisko}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        name="haslo"
                        placeholder="Hasło"
                        value={formData.haslo}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <select name="rola" value={formData.rola} onChange={handleChange} required>
                        <option value="pracownik">Pracownik</option>
                        <option value="admin">Admin</option>
                    </select>
                    <br />
                    <button className="" type="submit" style={{ marginTop: 10 }}>
                        Dodaj użytkownika
                    </button>
                </form>
            </div>

            {loading ? (
                <p>Ładowanie użytkowników...</p>
            ) : (
                <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Email</th>
                            <th>Rola</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                    Brak użytkowników
                                </td>
                            </tr>
                        ) : (
                            users.map(({ id, imie, nazwisko, email, rola }) => (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{imie}</td>
                                    <td>{nazwisko}</td>
                                    <td>{email}</td>
                                    <td>{rola}</td>
                                    <td>
                                        <button onClick={() => handleDeleteUser(id)} style={{ color: "red" }}>
                                            Usuń
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default AdminPanel;
