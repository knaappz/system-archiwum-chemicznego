import { useState, useEffect } from "react";
import axios from "axios";
import "./AddData.css";
import IloscSelect from "../Selects/IloscSelect/IloscSelect.jsx";
import OkresSelect from "../Selects/OkresSelect/OkresSelect.jsx";
import { calculateEndDate, handleFormChange } from "../FormUtils/formUtils.js";
import InneSelect from "../Selects/InneSelect/InneSelect.jsx";
import SurowceSelect from "../Selects/SurowceSelect/SurowceSelect.jsx";
import WyrobySelect from "../Selects/WyrobySelect/WyrobySelect.jsx";
import LokalizacjaSelect from "../Selects/LokalizacjaSelect/LokalizacjaSelect.jsx";

const AddData = () => {
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        grupa: "",
        nazwa: "",
        wydzial: "",
        nr_partii: "",
        nr_analizy: "",
        okres: "",
        data_archiwizacji: "",
        data_waznosci: "",
        ilosc: "",
        lokalizacja: "",
        dostepnosc: true,
        uwagi: ""
    });

    // OBLICZANIE DATY WAZNOSCI Z KOMPONENTEM CALUCLATEENDDATE
    useEffect(() => {
        if (formData.data_archiwizacji && formData.okres) {
            setFormData((prevData) => ({
                ...prevData,
                data_waznosci: calculateEndDate(prevData.data_archiwizacji, prevData.okres)
            }));
        }
    }, [formData.data_archiwizacji, formData.okres]);

    // WYBÓR SUROWIEC/WYRÓB
    const handleChange = (e) => {
        const { name, value, selectedOption } = e.target;

        if (name === "nazwa") {
            const wydzial = selectedOption?.wydzial || "";
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                wydzial
            }));
        } else {
            handleFormChange(formData, setFormData, e);
        }
    };

    // WYSŁANIE DO BAZY DANYCH
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const finalData = { ...formData };
            await axios.post("http://localhost:8080/api/data", finalData);
            setMessage(`Dodano ${finalData.nazwa} | nr analizy: ${finalData.nr_analizy}`);
        } catch (error) {
            setMessage("Błąd podczas zapisu...");
            console.error(error);
        }
    };

    return (
        <>
            <section className="container">
                <form
                    autoComplete="off"
                    className="add-container"
                    onSubmit={handleSubmit}
                >
                    <label> Wybór grupy substancji:
                        <select name="grupa" value={formData.grupa} onChange={handleChange} required>
                            <option value="">Wyrób, surowiec, inne...</option>
                            <option value="surowiec">Surowiec</option>
                            <option value="wyrob">Wyrób</option>
                            <option value="inne">Inne</option>
                        </select>
                    </label>

                    {/* WYBÓR GRUPY SUBSTANCJI */}
                    {formData.grupa === "surowiec" && (
                        <label>
                            <SurowceSelect
                                value={formData.nazwa}
                                onChange={handleChange}
                            />
                        </label>
                    )}

                    {formData.grupa === "wyrob" && (
                        <label>
                            <WyrobySelect
                                value={formData.nazwa}
                                onChange={handleChange}
                            />
                        </label>
                    )}

                    {formData.grupa === "inne" && (
                        <label>
                            <InneSelect

                                value={formData.nazwa}
                                onChange={handleChange}
                            />
                        </label>
                    )}
                    {/* ^ ^ ^ ^ */}

                    {/* WPROWADZANIE NR PARTII, NR ANALIZY */}
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
                    {/* ^ ^ ^ ^ */}

                    {/* WPROWADZANIE OKRESU, DATY ARCHIWIZACJI */}
                    <div className="deadline-date">
                        <label>
                            Okres:
                            <OkresSelect
                                value={formData.okres}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Data archiwizacji:
                            <input
                                type="date"
                                name="data_archiwizacji"
                                value={formData.data_archiwizacji}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    {/* ^ ^ ^ ^ */}

                    {/* WIELKOŚĆ PRÓBKI */}
                    <label>
                        Wielkość próbki:
                        <IloscSelect
                            value={formData.ilosc}
                            onChange={handleChange}
                        />
                    </label>
                    {/* ^ ^ ^ ^ */}

                    {/* WPROWADZENIE LOKALIZACJI */}
                    <label>
                        Lokalizacja:
                        <LokalizacjaSelect
                            value={formData.lokalizacja}
                            onChange={handleChange}
                        />
                    </label>
                    {/* ^ ^ ^ ^ */}

                    <button type="submit">Dodaj +</button>
                </form>
            </section>
            <div className="message">{message}</div>
        </>
    );
};

export default AddData;