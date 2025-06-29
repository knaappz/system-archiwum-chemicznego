import React, { useEffect, useState } from "react";
import axios from "axios";
import './Home.css'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

const Home = () => {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/data");
            // console.log(`Pobrano dane!`)
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const counts = data.reduce((acc, item) => {
            const wydzial = item.wydzial || "Brak wydziału";
            acc[wydzial] = (acc[wydzial] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.entries(counts).map(([wydzial, count]) => ({
            wydzial,
            count
        }));
        setChartData(formattedData);
    }, [data]);

    return (
        <section className="home-page">

            <div className="chart-wrapper">
                {chartData.length === 0 ? (
                    <p className="empty-message">Brak dostępnych próbek w magazynie.</p>
                ) : (
                    <>
                        <p>Ilość dostępnych próbek (według wydziałów)</p>
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="wydzial" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                )}
            </div>
        </section >
    );
};

export default Home;
