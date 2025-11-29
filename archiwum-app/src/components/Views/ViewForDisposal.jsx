import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from "moment";
import "./ViewAllTable.css"

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
                return expirationDate < today && item.uwagi?.toLowerCase() !== "zutylizowana";
            });
            setData(filteredData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDisposal = async () => {
        try {
            const sampleToUpdate = data.find(item => item.id === deleteId);

            await axios.put(`http://localhost:8080/api/data/${deleteId}`, {
                ...sampleToUpdate,
                dostepnosc: false,
                uwagi: "zutylizowana"
            });

            setDeleteId(null);
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Błąd podczas utylizacji próbki:", error);
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

            <section className='table-container'>
                <table className='disposal-table' border="1">
                    <thead>
                        <tr>
                            {/* <th>Akcje:</th> */}
                            <th>ID</th>
                            <th>Nazwa</th>
                            <th>Nr. partii</th>
                            <th>Nr. analizy</th>
                            <th>Data archiwizacji</th>
                            <th >Data ważności</th>
                            <th>Lokalizacja</th>
                            <th>Uwagi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr onClick={() => confirmDelete(item.id)} key={index}>
                                    {/* <td className="buttons-row">
                                        <button className='disposal-btn' onClick={() => confirmDelete(item.id)}>
                                            Utylizacja
                                        </button>
                                    </td> */}
                                    <td title={item.id}>{item.id}</td>
                                    <td title={item.nazwa} className="sample-names">{item.nazwa}</td>
                                    <td title={item.nr_partii}>{item.nr_partii}</td>
                                    <td title={item.nr_analizy}>{item.nr_analizy}</td>
                                    <td>{moment(item.data_archiwizacji).format('DD.MM.YYYY')}</td>
                                    <td>{moment(item.data_waznosci).format('DD.MM.YYYY')}</td>
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
            </section>

            {showModal && (
                <div className="action">
                    <div className="dialog-delete">
                        <p>Czy na pewno chcesz <b>zutylizować</b> tą próbkę?</p>
                        <div className="del-buttons-row">
                            <button onClick={handleDisposal}>Tak</button>
                            <button onClick={closeModal}>Nie</button>
                        </div>
                    </div>
                </div>
            )}
        </section>)
}

export default ViewForDisposal