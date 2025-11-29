import "./GuestModule.css";
import moment from "moment";

const GuestModule = ({ sample, onClose }) => {
    if (!sample) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Zestawienie dla próbki:</h2>
                <span className="capitalize">{sample.nazwa}</span>
                <p><strong>ID:</strong> {sample.id}</p>
                <p><strong>Grupa:</strong> {sample.grupa}</p>
                <p><strong>Nazwa:</strong> {sample.nazwa}</p>
                <p><strong>Wydział/Dostawca:</strong> {sample.wydzial}</p>
                <p><strong>Nr partii:</strong> {sample.nr_partii}</p>
                <p><strong>Nr analizy:</strong> {sample.nr_analizy}</p>
                <p><strong>Ilość:</strong> {sample.ilosc}</p>
                <p><strong>Okres:</strong> {sample.okres}</p>
                <p><strong>Data archiwizacji:</strong> {moment(sample.data_archiwizacji).format("DD.MM.YYYY")}</p>
                <p><strong>Data ważności:</strong> {moment(sample.data_waznosci).format("DD.MM.YYYY")}</p>
                <p><strong>Pokój / Lokalizacja:</strong> {sample.lokalizacja}</p>
                <p><strong>Status:</strong> {sample.dostepnosc === true ? "Dostępna" : "Niedostępna"}</p>
                <p><strong>Uwagi:</strong> {sample.uwagi}</p>

                <button onClick={onClose}>Zamknij</button>
            </div>
        </div>
    );
};

export default GuestModule;
