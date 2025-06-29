import { useState, useEffect } from "react";

const IloscSelect = ({ value, onChange }) => {
    const [ilosci, setIlosci] = useState([]);

    useEffect(() => {
        fetch("/ilosc.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setIlosci(data))
            .catch(error => console.error("Błąd ładowania ilości:", error));
    }, []);

    return (
        <select name="ilosc" value={value} onChange={onChange} required>
            <option value="">Wybierz opakowanie</option>
            {ilosci.map((ilosc, index) => (
                <option key={index} value={ilosc}>{ilosc}</option>
            ))}
        </select>
    );
};

export default IloscSelect;
