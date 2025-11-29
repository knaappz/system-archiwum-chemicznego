import React, { useState, useEffect } from "react";
import './OrderRegister.css'
import SamplesSelect from './SamplesSelect';
import moment from 'moment'

const OrderRegister = () => {
    const [formData, setFormData] = useState({
        zleceniodawca: '',
        odbiorca: '',
        uwagi: '',
        probka: null,
        wykonawca: ''
    });
    const [deleteId, setDeleteId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [reloadSamples, setReloadSamples] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/orders");
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error("Błąd ładowania zleceń:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSampleSelect = (e) => {
        setFormData(prev => ({ ...prev, probka: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.probka) {
            alert("Wybierz próbkę!");
            return;
        }

        const payload = {
            zleceniodawca: formData.zleceniodawca,
            odbiorca: formData.odbiorca,
            probka_id: formData.probka.id,
            uwagi: formData.uwagi
        };

        try {
            const res = await fetch("http://localhost:8080/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Błąd tworzenia zlecenia");

            const data = await res.json();

            setMessage("Zlecenie zostało utworzone!");

            setFormData({ zleceniodawca: '', odbiorca: '', uwagi: '', probka: null });
            setReloadSamples(prev => prev + 1);
            fetchOrders();
        } catch (err) {
            console.error("Błąd:", err);
            alert("Nie udało się utworzyć zlecenia.");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`http://localhost:8080/api/orders/${deleteId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Błąd usuwania zlecenia");

            fetchOrders();
            closeModal();
        } catch (err) {
            console.error("Błąd:", err);
            alert("Nie udało się usunąć zlecenia.");
        }
    };


    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setDeleteId(null);
    };



    return (
        <section id='order-register'>
            <section className='register'>
                <form onSubmit={handleSubmit}>
                    <h3>Nowe zlecenie</h3>

                    <label>
                        <input
                            type="text"
                            name="zleceniodawca"
                            placeholder='Zleceniodawca...'
                            value={formData.zleceniodawca}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        <input
                            type="text"
                            name="odbiorca"
                            placeholder='Odbiorca...'
                            value={formData.odbiorca}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Wybierz próbkę do wydania z bazy:
                        <SamplesSelect
                            value={formData.probka}
                            onChange={handleSampleSelect}
                            reload={reloadSamples}
                        />

                    </label>

                    <label>
                        <input
                            type="text"
                            name="uwagi"
                            placeholder='Uwagi do zlecenia...'
                            value={formData.uwagi}
                            onChange={handleChange}
                        />
                    </label>

                    <button type="submit">Utwórz</button>
                    <div className="message no-capitalize">{message}</div>
                </form>
            </section>

            <section className='orders' style={{ flex: 1 }}>
                {orders.length === 0 ? (
                    <p>Brak zleceń.</p>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="order-card">
                            <h4>Zlecenie nr: {order.id}</h4>
                            <div className="order-grid">
                                <div>
                                    <p className="capitalize"><strong>Próbka:</strong> {order.nazwa_probki || '---'}</p>
                                    <p><strong>Analiza:</strong> {order.nr_analizy || '---'}</p>
                                    <p><strong>Partia:</strong> {order.nr_partii || '---'}</p>
                                </div>
                                <div>
                                    <p className="capitalize"><strong>Zleceniodawca:</strong> {order.zleceniodawca}</p>
                                    <p className="capitalize"><strong>Odbiorca:</strong> {order.odbiorca}</p>
                                </div>
                                <div>
                                    <p><strong>Data:</strong> {moment(order.data_zlecenia).format("DD.MM.YYYY")}</p>
                                    {order.uwagi && <p><strong>Uwagi:</strong> {order.uwagi}</p>}
                                </div>
                            </div>
                            <button
                                className="delete-order"
                                onClick={() => confirmDelete(order.id)}
                            >
                                Usuń zlecenie
                            </button>
                        </div>

                    ))
                )}
            </section>

            {showModal && (
                <div className="action">
                    <div className="dialog-delete">
                        <p>Czy na pewno chcesz <b>usunąć</b> zlecenie?</p>
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

export default OrderRegister;
