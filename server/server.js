// GŁÓWNE API DLA SYSTEMU DODAWANIA PRÓBEK DO BAZY DANYCH /////////////////////////////////////////////////////////////
// IMPORTY
import express from "express";
import cors from "cors";
import pool from "./db.js";
import bcrypt from 'bcrypt';


const PORT = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());

// Pobranie wszystkich próbek
app.get("/api/data", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM archiwum_tb ORDER BY id");
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// Pobranie próbki po ID
app.get("/api/data/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query("SELECT * FROM archiwum_tb WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ msg: "Próbka nie znaleziona" });
        }
        res.send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// Dodanie nowej próbki
app.post("/api/data", async (req, res) => {
    const {
        grupa, nazwa, wydzial, nr_partii, nr_analizy, okres,
        data_archiwizacji, data_waznosci, ilosc, lokalizacja, dostepnosc, uwagi
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO archiwum_tb 
    (grupa, nazwa, wydzial, nr_partii, nr_analizy, okres, data_archiwizacji, data_waznosci, ilosc, lokalizacja, dostepnosc, uwagi) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
    RETURNING *`,
            [grupa, nazwa, wydzial, nr_partii, nr_analizy, okres, data_archiwizacji, data_waznosci, ilosc, lokalizacja, dostepnosc, uwagi]
        );

        res.status(201).send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});


// Aktualizacja próbki
app.put("/api/data/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const {
        grupa, nazwa, wydzial, nr_partii, nr_analizy, okres,
        data_archiwizacji, data_waznosci, ilosc, lokalizacja, dostepnosc, uwagi
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE archiwum_tb SET 
        grupa = $1,
        nazwa = $2,
        wydzial = $3,
        nr_partii = $4,
        nr_analizy = $5,
        okres = $6,
        data_archiwizacji = $7,
        data_waznosci = $8,
        ilosc = $9,
        lokalizacja = $10,
        dostepnosc = $11,
        uwagi = $12
    WHERE id = $13 
    RETURNING *`,
            [grupa, nazwa, wydzial, nr_partii, nr_analizy, okres, data_archiwizacji, data_waznosci, ilosc, lokalizacja, dostepnosc, uwagi, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send({ msg: "Próbka nie znaleziona" });
        }
        res.send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});


// Usunięcie próbki
app.delete("/api/data/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query("DELETE FROM archiwum_tb WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ msg: "Próbka nie znaleziona" });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// SŁOWNIK /////////////////////////////////////////////////////////////
// POBIERANIE
app.get("/api/surowce", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, nazwa, wydzial FROM surowce_tb ORDER BY id");
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

app.get("/api/wyroby", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, nazwa, wydzial FROM wyroby_tb ORDER BY id");
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// DODAWANIE
// DODAWANIE DO SUROWCÓW
app.post("/api/surowce", async (req, res) => {
    const { nazwa, wydzial } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO surowce_tb (nazwa, wydzial) VALUES ($1, $2) RETURNING *`,
            [nazwa, wydzial]
        );
        res.status(201).send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// DODAWANIE DO WYROBÓW
app.post("/api/wyroby", async (req, res) => {
    const { nazwa, wydzial } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO wyroby_tb (nazwa, wydzial) VALUES ($1, $2) RETURNING *`,
            [nazwa, wydzial]
        );
        res.status(201).send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// USUWANIE
// USUWANIE surowca
app.delete("/api/surowce/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM surowce_tb WHERE id = $1", [id]);
        res.sendStatus(204); // No content
    } catch (err) {
        console.error("Błąd przy usuwaniu surowca:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// USUWANIE WYROBU
app.delete("/api/wyroby/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM wyroby_tb WHERE id = $1", [id]);
        res.sendStatus(204); // No content
    } catch (err) {
        console.error("Błąd przy usuwaniu wyrobu:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});


// SYSTEM LOGOWANIA /////////////////////////////////////////////////////////////
// POBIERANIE DANYCH UŻYTKOWNIKA
app.get("/api/pracownicy", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, imie, nazwisko, email, rola FROM pracownicy_tb ORDER BY id");
        res.send(result.rows);
    } catch (err) {
        console.error("Błąd przy pobieraniu pracowników:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// LOGIN
app.post("/api/login", async (req, res) => {
    const { email, haslo } = req.body;

    try {
        const result = await pool.query("SELECT * FROM pracownicy_tb WHERE email = $1", [email]);

        if (result.rows.length === 0 || result.rows[0].haslo !== haslo) {
            return res.status(401).send({ msg: "Nieprawidłowy email lub hasło" });
        }

        const user = result.rows[0];

        res.send({
            msg: "Zalogowano",
            user: {
                id: user.id,
                imie: user.imie,
                nazwisko: user.nazwisko,
                email: user.email,
                rola: user.rola
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// TWORZENIE NOWEGO KONTA
app.post("/api/pracownicy", async (req, res) => {
    const { imie, nazwisko, email, haslo, rola } = req.body;

    try {
        // Możesz dodać sprawdzenie, czy email już istnieje (opcjonalne)
        const existingUser = await pool.query("SELECT id FROM pracownicy_tb WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).send({ msg: "Użytkownik z tym emailem już istnieje" });
        }

        const result = await pool.query(
            "INSERT INTO pracownicy_tb (imie, nazwisko, email, haslo, rola) VALUES ($1, $2, $3, $4, $5) RETURNING id, imie, nazwisko, email, rola",
            [imie, nazwisko, email, haslo, rola]
        );
        res.status(201).send(result.rows[0]);
    } catch (err) {
        console.error("Błąd przy tworzeniu konta:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// USUWANIE KONTA UŻYTKOWNIKA
app.delete("/api/pracownicy/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM pracownicy_tb WHERE id = $1 RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send({ msg: "Użytkownik nie znaleziony" });
        }

        res.status(204).send();
    } catch (err) {
        console.error("Błąd przy usuwaniu konta:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// EDYCJA KONTA / ZMIANA HASŁA
app.put("/api/pracownicy/:id", async (req, res) => {
    const { id } = req.params;
    const { imie, nazwisko, email, haslo, rola } = req.body;

    try {
        const result = await pool.query(
            "UPDATE pracownicy_tb SET imie = $1, nazwisko = $2, email = $3, haslo = $4, rola = $5 WHERE id = $6 RETURNING id, imie, nazwisko, email, rola",
            [imie, nazwisko, email, haslo, rola, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({ msg: "Użytkownik nie znaleziony" });
        }

        res.send(result.rows[0]);
    } catch (err) {
        console.error("Błąd przy edycji konta:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});


// NASŁUCHIWANIE
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
