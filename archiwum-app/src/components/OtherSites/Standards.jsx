import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import "./Other.css";

const Standards = () => {
    return (
        <section className='home-page'>
            <Link to='/'>
                <h1>
                    <FontAwesomeIcon icon={faAngleLeft} />
                    Standardy przechowywania
                </h1>
            </Link>

            <div className='standards-container'>
                <p>
                    W tym module zostaną przedstawione szczegółowe
                    informacje na temat przechowywania danych substancji. <br />
                    Dane te będą/są ustalane przez firme korzystającą z systemu archiwizacji.
                </p>

                <p>
                    <b>Przykładowo:</b> <br />
                    Wszystkie surowce mogą zostać podane archiwizacji na <b> 14 dni</b> od momentu trafienia do archiwum. <br />
                    Przykłady: <br />
                    - Alkohol Laurylowy <br />
                    - Alkohol izotridecylowy <br />
                    - Alkohol n-butylowy (n-butanol) <br />
                    - Fenol <br />
                    - Kwas siarkowy <br />
                    - Wodorotlenek sodu <br />
                    - Wodorotlenek potasu itd.<br />
                    <br />
                    Z reguły dwa tygiodnie w zupełności wystarczają dla surowców. Jednak są takie, które mogą wymagać dłuższego czasu przechowywania. <br />
                    Bierze się to z złożoności procesów chemicznych odbywających się na produkcji. <br />
                    Z przykładowych substancji mogą być to: <br />
                    - Wszystkie odmiany glikoli, okres przechowywania większy/równy <b>6 mies.</b> <br />
                    - Sorbitol większy/równy <b>12 mies.</b> <br /><br />

                    Okres przechowywania dla wyrobów jest o wiele dłuższy. <b>Nie jest krótszy niż rok</b>, ze względów bezpieczeństwa w razie reklamacji klientów.
                    <br /> <br />
                    System archiwizacj posiada możliwość wpisania numerów/nazw pokoi w których będą przechowywane substancje chemiczne. <br />
                    Dla potrzeb projektowych jest to czterostopniowy system: <br />
                    - A, brak zagrożeń zdrowia (gotowe produkty) <br />
                    - B, brak zagrożeń zdrowia (gotowe produkty) <br />
                    - C, produkty żrące, śmierdzące i inne posiadające jakiekolwiek zagrożenia <br />
                    - D, pokój z surowcami, substancje niebezpieczne dla wdychania. <br />
                    <br />
                    <br />
                    <i>* * *</i> <br />
                    <i>W tym miejscu jest możliwość stworzenia miejsca z danymi dla wszystkich produktów/surowców w firmie...</i>
                </p>
            </div>


        </section>
    )
}

export default Standards