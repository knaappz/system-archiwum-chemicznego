import { useState, useEffect } from "react";
import LokalizacjaSelect from "../Selects/LokalizacjaSelect/LokalizacjaSelect";
import OkresSelect from "../Selects/OkresSelect/OkresSelect";
import IloscSelect from "../Selects/IloscSelect/IloscSelect";
import { calculateEndDate } from "../FormUtils/formUtils";
import './Edit.css'
import moment from "moment";
import axios from "axios";

const Edit = ({ sampleData, onClose, onSubmit, onDelete }) => {
    const [formData, setFormData] = useState({ ...sampleData });
    const [deleteId, setDeleteId] = useState();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setFormData({
            ...sampleData,
            data_archiwizacji: sampleData.data_archiwizacji
                ? moment(sampleData.data_archiwizacji).format('YYYY-MM-DD')
                : '',
            data_waznosci: sampleData.data_waznosci
                ? moment(sampleData.data_waznosci).format('YYYY-MM-DD')
                : '',
        });
    }, [sampleData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (formData.data_archiwizacji && formData.okres) {
            setFormData((prevData) => ({
                ...prevData,
                data_waznosci: calculateEndDate(prevData.data_archiwizacji, prevData.okres)
            }));
        }
    }, [formData.data_archiwizacji, formData.okres]);

    // ZAPIS ZMIAN/LUB ZAPIS ICH BRAKU
    const handleSubmit = (e) => {
        e.preventDefault();

        // data do zmiennej jak nie edytujemy bo cofa się
        const updatedFormData = { ...formData };

        if (updatedFormData.data_archiwizacji) {
            const formattedDate = moment(updatedFormData.data_archiwizacji).format('YYYY-MM-DD');
            updatedFormData.data_archiwizacji = formattedDate;
        }

        if (updatedFormData.data_waznosci) {
            const formattedWaznosci = moment(updatedFormData.data_waznosci).format('YYYY-MM-DD');
            updatedFormData.data_waznosci = formattedWaznosci;
        }
        onSubmit(updatedFormData);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        // setEditItem(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/data/${deleteId}`);
            setDeleteId(null);
            setShowModal(false);
            onDelete();
            onClose();
        } catch (error) {
            console.error("Błąd usuwania próbki:", error);
        }
    };

    return (
        <section className="dialog-edit">
            <button className="delete-btn" onClick={(e) => {
                e.stopPropagation();
                confirmDelete(formData.id);
            }}>
                <img src="/assets/icons/bin.png" alt="Usuń" title="Usuń permanentnie" />
            </button>
            <form
                autoComplete="off"
                className="add-container"
                onSubmit={handleSubmit}
            >
                <div><h3>Edytujesz: </h3>{formData.nazwa} | id: {formData.id}</div>
                <div className="numbers">
                    <label>
                        Numer partii:
                        <input
                            type="text"
                            inputMode="numeric"
                            name="nr_partii"
                            placeholder="np. 080425199"
                            maxLength={9}
                            value={formData.nr_partii}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Numer analizy:
                        <input
                            placeholder="np. 2356"
                            type="number"
                            name="nr_analizy"
                            value={formData.nr_analizy}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="deadline-date">
                    <label>
                        Okres archiwizacji:
                        <OkresSelect
                            value={formData.okres}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Data zarchiwizacji:
                        <input
                            type="date"
                            name="data_archiwizacji"
                            value={formData.data_archiwizacji}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <label>
                    Wielkość próbki:
                    <IloscSelect
                        value={formData.ilosc}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Lokalizacja:
                    <LokalizacjaSelect
                        value={formData.lokalizacja}
                        onChange={handleChange}
                    />
                </label>
                <div className="dostepnosc-checkbox">
                    Dostępność próbki:
                    <input
                        type="checkbox"
                        name="dostepnosc"
                        checked={formData.dostepnosc}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                dostepnosc: e.target.checked,
                            }))
                        }
                    />
                </div>
                <label>
                    Uwagi
                    <textarea
                        className="uwagi-text"
                        name="uwagi"
                        maxLength={100}
                        value={formData.uwagi || ""}
                        onChange={handleChange}
                        rows={4}
                    />
                </label>
                <div className="buttons-edit">
                    <button className="save-btn " type="submit">Zapisz zmiany</button>
                    <button className="cancel-btn" type="button" onClick={onClose}>Anuluj</button>
                </div>
            </form>
            {showModal && (
                <div className="action">
                    <div className="dialog-delete">
                        <>
                            <p>Czy na pewno chcesz <b>usunąć</b> tę próbkę?</p>
                            <div className="del-buttons-row">
                                <button onClick={handleDelete}>Tak</button>
                                <button onClick={closeModal}>Nie</button>
                            </div>
                        </>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Edit;