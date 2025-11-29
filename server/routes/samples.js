import express from "express";
import pool from "../db.js";

const router = express.Router();

// Pobierz wszystkie próbki
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM archiwum_tb ORDER BY id");
        res.send(result.rows);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// Pobierz próbkę po ID
router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query("SELECT * FROM archiwum_tb WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).send({ msg: "Nie znaleziono" });
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// Dodaj próbkę
router.post("/", async (req, res) => {
    const {
        grupa, nazwa, wydzial, nr_partii, nr_analizy, okres,
        data_archiwizacji, data_waznosci, ilosc, lokalizacja, dostepnosc, uwagi
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO archiwum_tb 
            (grupa, nazwa, wydzial, nr_partii, nr_analizy, okres, data_archiwizacji, data_waznosci, ilosc, lokalizacja, dostepnosc, uwagi)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            RETURNING *`,
            [grupa, nazwa, wydzial, nr_partii, nr_analizy, okres, data_archiwizacji, data_waznosci, ilosc, lokalizacja, dostepnosc, uwagi]
        );
        res.status(201).send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// Edytuj próbkę
router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const {
        grupa, nazwa, wydzial, nr_partii, nr_analizy, okres,
        data_archiwizacji, data_waznosci, ilosc, lokalizacja, dostepnosc, uwagi
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE archiwum_tb SET 
            grupa=$1, nazwa=$2, wydzial=$3, nr_partii=$4, nr_analizy=$5, okres=$6,
            data_archiwizacji=$7, data_waznosci=$8, ilosc=$9, lokalizacja=$10,
            dostepnosc=$11, uwagi=$12 WHERE id=$13 RETURNING *`,
            [grupa, nazwa, wydzial, nr_partii, nr_analizy, okres, data_archiwizacji, data_waznosci, ilosc, lokalizacja, dostepnosc, uwagi, id]
        );

        if (result.rows.length === 0) return res.status(404).send({ msg: "Nie znaleziono próbki" });
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// Usuń próbkę
router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query("DELETE FROM archiwum_tb WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) return res.status(404).send({ msg: "Nie znaleziono próbki" });
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

export default router;
