import React from "react";

const LokalizacjaSelect = ({ value, onChange }) => {
    const lokalizacje = ["A", "B", "C", "D"];

    return (
        <select
            name="lokalizacja"
            value={value}
            onChange={onChange}
            required >
            <option value="">Wybierz lokalizację</option>
            {lokalizacje.map((lok, index) => (
                <option key={index} value={lok}>
                    Pokój {lok}
                </option>
            ))}
        </select>
    );
};

export default LokalizacjaSelect;
