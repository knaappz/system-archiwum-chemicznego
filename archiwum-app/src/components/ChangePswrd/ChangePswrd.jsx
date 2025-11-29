import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import './ChangePswrd.css';

const ChangePswrd = () => {
    return (
        <section className="change-pswrd">
            <Link to={'/'}><FontAwesomeIcon icon={faAngleLeft} />Powrót</Link>

            <div>Wprowadź email oraz nowe hasło:</div>
            <input type="text" placeholder="email" />
            <input type="text" placeholder="stare hasło" />
            <input type="text" placeholder="nowe hasło" />
            <p>Nie pamiętasz hasła?<br /> Skontaktuj się z pomocą techniczną. <br />Nr tel: 999 999 999</p>
            <button type="submit">Zatwierdź zmiany</button>
        </section>

    );
};

export default ChangePswrd;
