import React, { useState, useEffect } from "react";

const OkresSelect = ({ value, onChange }) => {
    const [okresy, setOkresy] = useState([]);

    useEffect(() => {
        fetch("/okres.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setOkresy(data))
            .catch(error => console.error("Błąd ładowania okresów:", error));
    }, []);

    return (
        <select name="okres" value={value} onChange={onChange} required>
            <option value="">Wybierz okres</option>
            {okresy.map((okres, index) => (
                <option key={index} value={okres}>{okres}</option>
            ))}
        </select>
    );
};

export default OkresSelect;
