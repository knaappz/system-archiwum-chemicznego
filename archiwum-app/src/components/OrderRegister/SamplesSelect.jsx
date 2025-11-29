import { useState, useEffect } from "react";
import Select from "react-select";

const SamplesSelect = ({ value, onChange, reload }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/data")
            .then(res => res.json())
            .then(data => {
                const grouped = data
                    .filter(item => item.dostepnosc === true)
                    .reduce((acc, item) => {
                        const group = item.nazwa || "Inna próbka";
                        if (!acc[group]) acc[group] = [];

                        acc[group].push({
                            value: item.id,
                            label: `Id: ${item.id} | Analiza: ${item.nr_analizy} | PK: ${item.nr_partii || "brak"}`,
                            fullData: item
                        });

                        return acc;
                    }, {});

                const formatted = Object.entries(grouped).map(([label, options]) => ({
                    label,
                    options
                }));

                setOptions(formatted);
            })
            .catch(err => console.error("Błąd ładowania próbek:", err));
    }, [reload]);

    const customFilter = (option, searchText) => {
        const { fullData } = option.data;
        const search = searchText.toLowerCase();

        return (
            fullData?.nazwa?.toLowerCase().includes(search) ||
            fullData?.nr_analizy?.toLowerCase().includes(search) ||
            fullData?.nr_partii?.toLowerCase().includes(search)
        );
    };

    const handleSelectChange = (selectedOption) => {
        const syntheticEvent = {
            target: {
                name: "probka",
                value: selectedOption?.fullData || null
            }
        };
        onChange(syntheticEvent);
    };

    return (
        <Select
            options={options}
            value={
                options
                    .flatMap(group => group.options)
                    .find(opt => opt.fullData?.id === value?.id) || null
            }
            onChange={handleSelectChange}
            placeholder="Wpisz nazwe/nr nalizy/partie..."
            isClearable
            filterOption={customFilter}
        />
    );
};

export default SamplesSelect;
