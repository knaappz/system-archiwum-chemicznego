import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Other.css';
import { knowledgeData } from './knowledgeData';

const Knowledge = () => {
    const [selected, setSelected] = useState(knowledgeData[0]);

    return (
        <section className='home-page'>
            <Link to='/'>
                <h1>
                    <FontAwesomeIcon icon={faAngleLeft} /> Baza wiedzy
                </h1>
            </Link>

            <div className="knowledge-container">
                <nav className="knowledge-sidebar">
                    <ul>
                        {knowledgeData.map((group) => (
                            <li
                                key={group.id}
                                onClick={() => setSelected(group)}
                                className={selected.id === group.id ? 'active' : ''}
                            >
                                {group.title}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="knowledge-content">
                    <h2>{selected.title}</h2>
                    <div className="examples">{selected.examples}</div>

                    {selected.groups && selected.groups.map((grp, idx) => (
                        <div key={idx} className="group">
                            <h3>{grp.name}</h3>

                            {grp.image && (
                                <div>
                                    <img src={grp.image} alt={grp.name} />
                                    {grp.description && <p>{grp.description}</p>}
                                </div>
                            )}

                            {grp.properties.length > 0 && (
                                <>
                                    <h4></h4>
                                    <ul>
                                        {grp.properties.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                </>
                            )}

                            {grp.hazards.length > 0 && (
                                <>
                                    <h4>Zagrożenia</h4>
                                    <ul className="hazard-list">
                                        {grp.hazards.map((h, i) => <li key={i}>{h}</li>)}
                                    </ul>
                                </>
                            )}

                            {idx < selected.groups.length - 1 && <hr className="group-separator" />}
                        </div>
                    ))}

                    {selected.images && (
                        <div className="images-section">
                            {selected.images.map((src, idx) => (
                                <img key={idx} src={src} alt={`Instrukcja ${idx + 1}`} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Knowledge;
