import { Link } from 'react-router-dom'

const NoPage = () => {
    return (
        <section className='nopage'>
            <h1>Błąd ładowania strony...</h1>
            <p>Wróć na <Link to="/">strone główną</Link>...
            </p>
            <img src="/assets/death.png" alt="" />
        </section>
    )
}

export default NoPage