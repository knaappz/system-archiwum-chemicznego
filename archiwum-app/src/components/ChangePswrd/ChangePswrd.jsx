import { Link } from "react-router-dom"
import './ChangePswrd.css'

const ChangePswrd = () => {

    // logika zmiany hasła itd.


    return (
        <section className="change-pswrd">
            <Link to="/app">Powrót</Link>
            <div>Wprowadź swoje dane:</div>
            <input type="text" placeholder="email" />
            <input type="text" placeholder="stare hasło" />
            <input type="text" placeholder="hasło" />
            <p>Nie pamiętasz hasła?<br /> Skontaktuj się z pomocą techniczną...</p>
            <button type="submit">Zatwierdź zmiany</button>
        </section>
    )
}

export default ChangePswrd