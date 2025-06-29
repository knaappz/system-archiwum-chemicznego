import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from "moment";
import "./Table.css"

const ViewForDisposal = () => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/data");
            const today = new Date();
            const filteredData = response.data.filter(item => {
                const expirationDate = new Date(item.data_waznosci);
                return expirationDate < today;
            });

            setData(filteredData);
            console.log("Fetching success!");
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/data/${deleteId}`);
            setDeleteId(null);
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Błąd usuwania próbki:", error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    return (
        <section>
            <h1>Próbki do utylizacji</h1>
            <div className="disposal-table-container">
                <table border="1">
                    <thead>
                        <tr>
                            <th>Akcje:</th>
                            <th>ID</th>
                            <th>Nazwa</th>
                            <th>Nr. partii</th>
                            <th>Nr. analizy</th>
                            <th>Data archiwizacji</th>
                            <th className='date-red'>Data ważności</th>
                            <th>Lokalizacja</th>
                            <th>Uwagi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td className="buttons-row">
                                        <button onClick={() => confirmDelete(item.id)}>
                                            <img src="/assets/icons/bin.png" alt="" />
                                        </button>
                                    </td>
                                    <td title={item.id}>{item.id}</td>
                                    <td title={item.nazwa} className="sample-names">{item.nazwa}</td>
                                    <td title={item.nr_partii}>{item.nr_partii}</td>
                                    <td title={item.nr_analizy}>{item.nr_analizy}</td>
                                    <td title={item.data_archiwizacji}>{moment(item.data_archiwizacji).format('DD.MM.YYYY')}</td>
                                    <td title={item.data_waznosci}>{moment(item.data_waznosci).format('DD.MM.YYYY')}</td>
                                    <td title={item.lokalizacja}>{item.lokalizacja}</td>
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
            </div>

            {showModal && (
                <div className="action">
                    <div className="dialog-delete">
                        <p>Czy na pewno chcesz usunąć tę próbkę?</p>
                        <div className="buttons-row">
                            <button onClick={handleDelete}>Tak</button>
                            <button onClick={closeModal}>Nie</button>
                        </div>
                    </div>
                </div>
            )}
        </section>)
}

export default ViewForDisposal