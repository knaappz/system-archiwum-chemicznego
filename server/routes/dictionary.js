import express from "express";
import pool from "../db.js";

const router = express.Router();

// SUROWCE
router.get("/surowce", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM surowce_tb ORDER BY id");
        res.send(result.rows);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

router.post("/surowce", async (req, res) => {
    const { nazwa, wydzial } = req.body;
    try {
        const result = await pool.query("INSERT INTO surowce_tb (nazwa, wydzial) VALUES ($1, $2) RETURNING *", [nazwa, wydzial]);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

router.delete("/surowce/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM surowce_tb WHERE id = $1", [id]);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// WYROBY
router.get("/wyroby", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM wyroby_tb ORDER BY id");
        res.send(result.rows);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

router.post("/wyroby", async (req, res) => {
    const { nazwa, wydzial } = req.body;
    try {
        const result = await pool.query("INSERT INTO wyroby_tb (nazwa, wydzial) VALUES ($1, $2) RETURNING *", [nazwa, wydzial]);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

router.delete("/wyroby/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM wyroby_tb WHERE id = $1", [id]);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

export default router;
