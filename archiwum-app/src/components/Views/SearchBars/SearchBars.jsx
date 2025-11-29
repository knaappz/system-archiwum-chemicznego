import React, { useState } from 'react';
import './Searchbars.css';
import OkresSelect from '../../Selects/OkresSelect/OkresSelect';
import IloscSelect from '../../Selects/IloscSelect/IloscSelect';
import LokalizacjaSelect from '../../Selects/LokalizacjaSelect/LokalizacjaSelect';

export const SearchBars = ({ filters, onFilterChange }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'data_archiwizacji' && value) {
            // Format na "YYYY-MM-DD" natywnie
            const formattedDate = new Date(value).toISOString().split("T")[0];
            onFilterChange(name, formattedDate);
        } else {
            onFilterChange(name, value);
        }
    };

    const toggleAdvancedFilters = () => {
        setShowAdvanced(prev => !prev);
    };

    return (
        <section className='search-wrapper'>
            <div className="searchbars">
                <p>Opcje wyszukiwania:</p>
                <label><input name="id" placeholder="nr id" type="number" value={filters.id} onChange={handleChange} /></label>

                <label>
                    <select name="grupa" value={filters.grupa} onChange={handleChange}>
                        <option value="">Grupa</option>
                        <option value="surowiec">Surowiec</option>
                        <option value="wyrob">Wyrób</option>
                        <option value="inne">Inne</option>
                    </select>
                </label>
                <label><input name="nazwa" placeholder="nazwa próbki" type="text" value={filters.nazwa} onChange={handleChange} /></label>
                <label><input name="wydzial" placeholder="wydział/dostawca" type="text" value={filters.wydzial} onChange={handleChange} /></label>
                <label><input name="nr_partii" placeholder="nr partii" type="text" value={filters.nr_partii} onChange={handleChange} /></label>
                <label><input name="nr_analizy" placeholder="nr analizy" type="number" value={filters.nr_analizy} onChange={handleChange} /></label>
                <button type="button" onClick={toggleAdvancedFilters}>
                    {showAdvanced ? 'Ukryj dodatkowe filtry' : 'Pokaż więcej filtrów'}
                </button>
            </div>

            {showAdvanced && (
                <div className="searchbars-2">
                    <label><IloscSelect onChange={handleChange} /></label>
                    <label><OkresSelect onChange={handleChange} /></label>
                    <label><LokalizacjaSelect onChange={handleChange} /></label>

                    <label>
                        <select name="dostepnosc" value={filters.dostepnosc} onChange={handleChange}>
                            <option value="">Status</option>
                            <option value="true">Dostępna</option>
                            <option value="false">Niedostępna</option>
                        </select>
                    </label>
                    <label><input name="uwagi" placeholder="uwagi" type="text" value={filters.uwagi} onChange={handleChange} /></label>

                </div>
            )}
        </section>
    );
};
