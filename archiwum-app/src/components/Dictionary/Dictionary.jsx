import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dictionary.css'

const Dictionary = () => {
    const [view, setView] = useState('surowce');
    const [formData, setFormData] = useState({ nazwa: '', wydzial: '' });
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/${view}`);
            setData(response.data);
        } catch (err) {
            console.error('Błąd przy pobieraniu danych:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [view]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.toLowerCase()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/api/${view}`, formData);
            setFormData({ nazwa: '', wydzial: '' });
            fetchData();
        } catch (err) {
            console.error('Błąd przy dodawaniu:', err);
        }
    };

    const confirmDelete = (id, item) => {
        setDeleteItem(id);
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/${view}/${deleteItem}`);
            setShowModal(false);
            setDeleteItem(null);
            fetchData();
        } catch (err) {
            console.error("Błąd przy usuwaniu:", err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setDeleteItem(null);
    };

    return (
        <section className='dictionary-container'>
            <h1>Słownik substancji /// {view}</h1>

            <div className="form-container">
                <div className='group-buttons'>
                    <button
                        className={view === 'surowce' ? 'toggle-btn active' : 'toggle-btn'}
                        onClick={() => setView('surowce')}
                    >
                        Surowce
                    </button>
                    <button
                        className={view === 'wyroby' ? 'toggle-btn active' : 'toggle-btn'}
                        onClick={() => setView('wyroby')}
                    >
                        Wyroby
                    </button>
                </div>

                <form className='dictionary-form' onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="nazwa"
                        placeholder={`Nazwa ${view === 'surowce' ? 'surowca' : 'wyrobu'}`}
                        value={formData.nazwa}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="wydzial"
                        placeholder="Wydział/dostawca"
                        value={formData.wydzial}
                        onChange={handleChange}
                        required
                    />
                    <button className='add-btn' type="submit">Dodaj</button>
                </form>

                <input
                    type="text"
                    placeholder="Szukaj po nazwie lub wydziale"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                />

            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Wydział/Dostawca</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.filter(item =>
                            item.nazwa.toLowerCase().includes(searchTerm) ||
                            item.wydzial.toLowerCase().includes(searchTerm)
                        ).length === 0 ? (
                            <tr>
                                <td colSpan="2">Brak wyników...</td>
                            </tr>
                        ) : (
                            data.filter(item =>
                                item.nazwa.toLowerCase().includes(searchTerm) ||
                                item.wydzial.toLowerCase().includes(searchTerm)
                            ).map((item, index) => (
                                <tr key={index} onClick={() => confirmDelete(item.id, item)}>
                                    <td className='sample-names'>{item.nazwa}</td>
                                    <td className='company-names'>{item.wydzial}</td>
                                </tr>
                            ))
                        )
                    }

                </tbody>
            </table>
            {showModal && (
                <div className="action-dictionary">
                    <div className="dialog-delete">
                        <p>
                            Czy na pewno chcesz usunąć z słownika: <br />
                            substancje: {selectedItem?.nazwa.charAt(0).toUpperCase() + selectedItem?.nazwa.slice(1)} <br />
                            dostawca: {selectedItem?.wydzial.toUpperCase()}
                        </p>
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

export default Dictionary;
