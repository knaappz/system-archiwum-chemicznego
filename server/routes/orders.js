// backend rejestru zleceń

import express from "express";
import pool from "../db.js";

const router = express.Router();

// pobieranie danych zleceń
// Pobierz wszystkie zlecenia z danymi próbki
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                z.id,
                z.zleceniodawca,
                z.odbiorca,
                z.probka_id,
                z.data_zlecenia,
                z.uwagi,
                a.nazwa AS nazwa_probki,
                a.nr_analizy,
                a.nr_partii,
                a.wydzial,
                a.dostepnosc
            FROM zlecenia_tb z
            JOIN archiwum_tb a ON z.probka_id = a.id
            ORDER BY z.data_zlecenia DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Błąd przy pobieraniu zleceń:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});


// pobieranie konkretnego zlecenia
router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query("SELECT * FROM zlecenia_tb WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).send({ msg: "Nie znaleziono zlecenia" });
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// tworzenie zlecenia
router.post("/", async (req, res) => {
    const { zleceniodawca, odbiorca, probka_id, uwagi } = req.body;

    try {

        const orderResult = await pool.query(
            `INSERT INTO zlecenia_tb (zleceniodawca, odbiorca, probka_id, uwagi, data_zlecenia)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id`,
            [zleceniodawca, odbiorca, probka_id, uwagi]
        );

        const newOrderId = orderResult.rows[0].id;


        await pool.query(
            `UPDATE archiwum_tb
       SET dostepnosc = false,
           uwagi = COALESCE(uwagi, '') || ' | Wydano do badań zlecenie nr: ' || $1
       WHERE id = $2`,
            [newOrderId, probka_id]
        );

        res.status(201).json({ id: newOrderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Błąd serwera podczas tworzenia zlecenia" });
    }
});

// edycja - niedziała jeszcze
router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { zleceniodawca, odbiorca, probka_id, uwagi } = req.body;
    try {
        const result = await pool.query(
            `UPDATE zlecenia_tb SET 
                zleceniodawca = $1,
                odbiorca = $2,
                probka_id = $3,
                uwagi = $4
             WHERE id = $5 RETURNING *`,
            [zleceniodawca, odbiorca, probka_id, uwagi, id]
        );
        if (result.rows.length === 0) return res.status(404).send({ msg: "Nie znaleziono zlecenia" });
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ msg: "Błąd przy edycji zlecenia" });
    }
});

// usuwanie zlecenia
router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query("DELETE FROM zlecenia_tb WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) return res.status(404).send({ msg: "Nie znaleziono zlecenia" });
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

export default router;
