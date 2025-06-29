import { useEffect, useState } from "react";
import axios from "axios";
import "./Table.css";
import { SearchBars } from "./SearchBars/SearchBars";
import Edit from "../Edit/Edit";
import moment from 'moment'

const ViewAllData = () => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState();
    const [userRole, setUserRole] = useState('');
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
        fetchData();
    };

    // FILTRY
    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const filteredData = data.filter((item) =>
        Object.keys(filters).every((key) =>
            String(item[key] ?? '').toLowerCase().includes(filters[key].toLowerCase())
        )
    );

    // EDYCJA
    const handleEditSubmit = async (updatedData) => {
        try {
            await axios.put(`http://localhost:8080/api/data/${updatedData.id}`, updatedData);
            fetchData();
            closeModal();
        } catch (error) {
            console.error("Błąd podczas edycji próbki:", error);
        }
    };

    // EDYCJA POTWIERDZENIE
    const confirmEdit = (id) => {
        const itemToEdit = data.find(item => item.id === id);
        setEditItem(itemToEdit);
        setShowModal(true);
    };

    // ZAMKNIECIE MODALA
    const closeModal = () => {
        setShowModal(false);
        setEditItem(null);
    };

    // TYMCZASOWE LOGOWANIE I OGRANICZENIA
    useEffect(() => {
        fetchData();
        const role = localStorage.getItem('userRole');
        if (role) {
            setUserRole(role);
        }
    }, []);

    return (
        <section className="table-wrapper">
            <SearchBars filters={filters} onFilterChange={handleFilterChange} />
            <section className="table-container">
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Grupa</th>
                            <th>Nazwa</th>
                            <th>Wydział/Dostawca</th>
                            <th>Nr. partii</th>
                            <th>Nr. analizy</th>
                            <th>Opakowanie</th>
                            <th>Okres archiwizacji</th>
                            <th>Data archiwizacji</th>
                            <th>Data ważności</th>
                            <th>Lokalizacja</th>
                            <th>Dostępność</th>
                            <th>Uwagi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item.id} onClick={() => userRole !== 'gosc' && confirmEdit(item.id)} className="clickable-row">
                                    <td title={item.id} >{item.id}</td>
                                    <td title={item.grupa} className="sample-names">{item.grupa}</td>
                                    <td title={item.nazwa} className="sample-names">{item.nazwa}</td>
                                    <td title={item.wydzial} className="company-names">{item.wydzial}</td>
                                    <td title={item.nr_partii}>{item.nr_partii}</td>
                                    <td title={item.nr_analizy}>{item.nr_analizy}</td>
                                    <td title={item.ilosc}>{item.ilosc}</td>
                                    <td title={item.okres}>{item.okres}</td>
                                    <td title={item.data_archiwizacji}>{moment(item.data_archiwizacji).format("DD.MM.YYYY")}</td>
                                    <td title={item.data_waznosci}>{moment(item.data_waznosci).format("DD.MM.YYYY")}</td>
                                    <td title={item.lokalizacja}>{item.lokalizacja}</td>
                                    <td >{item.dostepnosc === true ? (<>tak</>) : (<>nie</>)}</td>
                                    <td title={item.uwagi}>{item.uwagi}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12">Brak wyników...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
            {showModal && (
                <div className="action">
                    <div className="dialog-edit">
                        <Edit
                            sampleData={editItem}
                            onClose={closeModal}
                            onSubmit={handleEditSubmit}
                            onDelete={fetchData}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default ViewAllData;