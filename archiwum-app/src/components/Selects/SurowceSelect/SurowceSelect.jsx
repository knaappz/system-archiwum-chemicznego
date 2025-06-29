import React, { useState, useEffect } from "react";
import Select from "react-select";

const SurowceSelect = ({ value, onChange }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/surowce")
            .then(res => res.json())
            .then(data => {
                const grouped = data.reduce((acc, item, index) => {
                    const group = item.wydzial || "Inna firma";
                    if (!acc[group]) acc[group] = [];
                    acc[group].push({
                        value: item.nazwa + "|" + item.wydzial + "|" + index,
                        label: item.nazwa,
                        name: item.nazwa,
                        wydzial: item.wydzial
                    });
                    return acc;
                }, {});

                const formatted = Object.entries(grouped).map(([label, options]) => ({
                    label,
                    options
                }));

                setOptions(formatted);
            })
            .catch(err => console.error("Błąd ładowania surowców:", err));
    }, []);


    const handleSelectChange = (selectedOption) => {
        const syntheticEvent = {
            target: {
                name: "nazwa",
                value: selectedOption?.name,
                selectedOption: selectedOption
            }
        };
        onChange(syntheticEvent);
    };

    return (
        <Select
            options={options}
            value={options
                .flatMap(group => group.options)
                .find(opt => opt.name === value) || null}
            onChange={handleSelectChange}
            placeholder="Wybierz surowiec..."
            isClearable
            required
        />
    );
};

export default SurowceSelect;
