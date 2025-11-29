import { useEffect, useState } from "react";
import axios from "axios";
import "../ViewAllTable.css"
import { SearchBars } from "../SearchBars/SearchBars";
import moment from 'moment'
import GuestModule from "./GuestModule";

const ViewAllDataGuest = () => {
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [sortColumn, setSortColumn] = useState('data_archiwizacji');
    const [selectedSample, setSelectedSample] = useState(null);
    const [filters, setFilters] = useState({
        id: '',
        grupa: '',
        nazwa: '',
        wydzial: '',
        nr_partii: '',
        nr_analizy: '',
        ilosc: '',
        okres: '',
        data_archiwizacji: '',
        data_waznosci: '',
        lokalizacja: '',
        dostepnosc: ''
    });

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/data");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // FILTRY
    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const filteredData = data.filter((item) =>
        Object.keys(filters).every((key) =>
            String(item[key] ?? '').toLowerCase().includes(filters[key].toLowerCase())
        )
    );

    // SORTOWANIE PO DACIE
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortColumn === 'data_waznosci' || sortColumn === 'data_archiwizacji') {
            const dateA = new Date(a[sortColumn]);
            const dateB = new Date(b[sortColumn]);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
        return 0;
    });

    return (
        <section className="table-wrapper">
            <h1>Główna tabela próbek</h1>
            <SearchBars filters={filters} onFilterChange={handleFilterChange} />
            <section className="table-container">
                <table className="view-all-table" border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th className="random-column">Grupa</th>
                            <th>Nazwa</th>
                            <th>Wydział/Dostawca</th>
                            <th>Nr. partii</th>
                            <th>Nr. analizy</th>
                            <th className="random-column">Ilość</th>
                            <th className="random-column">Okres</th>
                            <th onClick={() => handleSort('data_archiwizacji')} className="sortable">
                                Data archiwizacji {sortColumn === 'data_archiwizacji' ? (sortOrder === 'asc' ? '↑' : '↓') : '↓'}
                            </th>
                            <th onClick={() => handleSort('data_waznosci')} className="sortable">
                                Data ważności {sortColumn === 'data_waznosci' ? (sortOrder === 'asc' ? '↑' : '↓') : '↓'}
                            </th>
                            <th className="random-column">Pokój</th>
                            <th>Status</th>
                            <th>Uwagi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            sortedData.map((item) => (
                                <tr key={item.id} className="clickable-row" onClick={() => setSelectedSample(item)}>
                                    <td title={item.id} >{item.id}</td>
                                    <td title={item.grupa} className="sample-names random-column">{item.grupa}</td>
                                    <td title={item.nazwa} className="sample-names">{item.nazwa}</td>
                                    <td title={item.wydzial} className="company-names">{item.wydzial}</td>
                                    <td title={item.nr_partii}>{item.nr_partii}</td>
                                    <td title={item.nr_analizy}>{item.nr_analizy}</td>
                                    <td className="random-column" title={item.ilosc}>{item.ilosc}</td>
                                    <td className="random-column" title={item.okres}>{item.okres}</td>
                                    <td>{moment(item.data_archiwizacji).format("DD.MM.YYYY")}</td>
                                    <td>{moment(item.data_waznosci).format("DD.MM.YYYY")}</td>
                                    <td className="random-column" title={item.lokalizacja}>{item.lokalizacja}</td>
                                    <td >{item.dostepnosc === true ? (<>Dostępna</>) : (<>Niedostępna</>)}</td>
                                    <td title={item.uwagi}>{item.uwagi}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13">Brak wyników...</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {selectedSample && (
                    <GuestModule
                        sample={selectedSample}
                        onClose={() => setSelectedSample(null)}
                    />
                )}

            </section>
        </section>
    );
};

export default ViewAllDataGuest;