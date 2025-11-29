import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import '../Home/Home.css'

const Analitics = () => {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [counter, setCounter] = useState(0);
    const [monthlyChartData, setMonthlyChartData] = useState([]);
    const [yearlyChartData, setYearlyChartData] = useState([]);
    const limitedChartData = [...chartData]
        .sort((a, b) => b.ilosc - a.ilosc)
        .slice(0, 20);

    // Pobieranie danych z bazy
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/data");
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Zliczanie według wydziałów
    useEffect(() => {
        const counts = data.reduce((acc, item) => {
            const wydzial = item.wydzial || "Brak wydziału";
            acc[wydzial] = (acc[wydzial] || 0) + 1;
            return acc;
        }, {});
        const formattedData = Object.entries(counts).map(([wydzial, ilosc]) => ({
            wydzial,
            ilosc
        }));
        setChartData(formattedData);
    }, [data]);

    // Zliczanie prób dostępnych na półkach
    useEffect(() => {
        const filtered = data.filter(
            sample => !(sample.dostepnosc === false && sample.uwagi?.toLowerCase() === "zutylizowana")
        );
        setCounter(filtered.length);
    }, [data]);

    // Zliczanie według miesięcy w bieżącym roku
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const monthlyCounts = data
            .filter(item =>
                item.data_archiwizacji &&
                item.data_archiwizacji.trim() !== '' &&
                new Date(item.data_archiwizacji).getFullYear() === currentYear
            )
            .reduce((acc, item) => {
                const date = new Date(item.data_archiwizacji);
                if (isNaN(date)) return acc;
                const monthKey = `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
                acc[monthKey] = (acc[monthKey] || 0) + 1;
                return acc;
            }, {});
        const formattedMonthlyData = Object.entries(monthlyCounts).map(([month, ilosc]) => ({
            month,
            ilosc
        }));
        setMonthlyChartData(formattedMonthlyData);
    }, [data]);

    // Zliczanie według lat
    useEffect(() => {
        const yearlyCounts = data
            .filter(item => item.data_archiwizacji && item.data_archiwizacji.trim() !== '')
            .reduce((acc, item) => {
                const date = new Date(item.data_archiwizacji);
                if (isNaN(date)) return acc;

                const yearKey = date.getFullYear();
                acc[yearKey] = (acc[yearKey] || 0) + 1;
                return acc;
            }, {});
        const formattedYearlyData = Object.entries(yearlyCounts).map(([year, ilosc]) => ({
            year,
            ilosc
        }));
        setYearlyChartData(formattedYearlyData);
    }, [data]);

    return (
        <>
            <section className="home-title">
                <Link to='/'>
                    <h1>
                        <FontAwesomeIcon icon={faAngleLeft} />
                        Panel analityczny</h1>
                </Link>
                <div className='sample-counter'>
                    Liczba &nbsp;<u>dostępnych</u>&nbsp; prób na półkach:&nbsp; <b>{counter}</b>
                </div>
                <div className='climate'>
                    <div className='room'>
                        <p><b>Pokój A</b></p>
                        <p>Temperatura: 23°C</p>
                        <p>Wilgotność: 45%</p>
                        <p>Czujnik dymu: OK</p>
                    </div>
                    <div className='room'>
                        <p><b>Pokój B</b></p>
                        <p>Temperatura: 21°C</p>
                        <p>Wilgotność: 40%</p>
                        <p>Czujnik dymu: OK</p>
                    </div>
                    <div className='room'>
                        <p><b>Pokój C</b></p>
                        <p>Temperatura: 23,5°C</p>
                        <p>Wilgotność: 48%</p>
                        <p>Czujnik dymu: OK</p>
                    </div>
                    <div className='room'>
                        <p><b>Pokój D</b></p>
                        <p>Temperatura: 21,3°C</p>
                        <p>Wilgotność: 42%</p>
                        <p>Czujnik dymu: OK</p>
                    </div>
                </div>

            </section >

            <section className='home-analitics'>
                <div className='chart-row'>
                    <div className="chart-wrapper">
                        {chartData.length === 0 ? (
                            <p className="empty-message">Brak dostępnych próbek w magazynie.</p>
                        ) : (
                            <>
                                <p>Ilość dostępnych próbek według wydziałów/dostawców</p>
                                <ResponsiveContainer>
                                    <BarChart data={limitedChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="wydzial" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="ilosc" fill="#8884d8" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </div>
                </div>

                <div className='chart-row'>
                    <div className="chart-wrapper">
                        {monthlyChartData.length === 0 ? (
                            <p className="empty-message">Brak danych archiwizacji do wyświetlenia.</p>
                        ) : (
                            <>
                                <p>Ilość próbek zarchiwizowanych według miesięcy w bieżącym roku</p>
                                <ResponsiveContainer>
                                    <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="ilosc" fill="#82ca9d" barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </div>
                </div>

                <div className='chart-row'>
                    <div className="chart-wrapper">
                        {yearlyChartData.length === 0 ? (
                            <p className="empty-message">Brak danych archiwizacji według lat.</p>
                        ) : (
                            <>
                                <p>Ilość próbek zarchiwizowanych według lat</p>
                                <ResponsiveContainer>
                                    <BarChart data={yearlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="ilosc" fill="#ffc658" barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </div>
                </div>


            </section>
        </>

    )
}

export default Analitics