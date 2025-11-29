import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { verifyToken, JWT_SECRET } from "../middleware/auth.js";

const router = express.Router();
const blacklist = new Set();

// POBIERANIE LISTY PRACOWNIKÓW
router.get("/pracownicy", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, imie, nazwisko, email, rola, haslo FROM pracownicy_tb ORDER BY id");
        res.send(result.rows);
    } catch (err) {
        console.error("Błąd przy pobieraniu pracowników:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, haslo } = req.body;

    try {
        const result = await pool.query("SELECT * FROM pracownicy_tb WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(401).send({ msg: "Nieprawidłowy email lub hasło" });

        const user = result.rows[0];

        const isMatch = user.haslo_tymczasowe
            ? haslo === user.haslo
            : await bcrypt.compare(haslo, user.haslo);

        if (!isMatch) return res.status(401).send({ msg: "Nieprawidłowy email lub hasło." });

        if (user.haslo_tymczasowe) {
            return res.send({
                mustChangePassword: true,
                user: {
                    id: user.id,
                    imie: user.imie,
                    nazwisko: user.nazwisko,
                    email: user.email
                }
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rola: user.rola },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.send({
            msg: "Zalogowano",
            token,
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

// LOGOUT
router.post("/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        blacklist.add(token);
        setTimeout(() => blacklist.delete(token), 3600000);
        res.send({ msg: "Wylogowano pomyślnie" });
    } else {
        res.status(400).send({ msg: "Brak tokena" });
    }
});

// USUWANIE USERA
router.delete("/pracownicy/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM pracownicy_tb WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).send({ msg: "Użytkownik nie istnieje" });
        }

        res.send({ msg: "Użytkownik usunięty" });
    } catch (err) {
        console.error("Błąd podczas usuwania użytkownika:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});


// ME
router.get("/me", verifyToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT id, imie, nazwisko, email, rola FROM pracownicy_tb WHERE id = $1", [req.user.id]);
        if (result.rows.length === 0) return res.status(404).send({ msg: "Użytkownik nie znaleziony" });
        res.send(result.rows[0]);
    } catch (err) {
        console.error("Błąd w /api/me:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// REJESTRACJA USERA
router.post("/pracownicy", async (req, res) => {
    const { imie, nazwisko, email, rola } = req.body;

    try {
        const existing = await pool.query("SELECT id FROM pracownicy_tb WHERE email = $1", [email]);
        if (existing.rows.length > 0) return res.status(400).send({ msg: "Użytkownik z tym emailem już istnieje" });

        const tempPassword = crypto.randomBytes(5).toString("hex");

        const result = await pool.query(
            "INSERT INTO pracownicy_tb (imie, nazwisko, email, haslo, rola, haslo_tymczasowe) VALUES ($1, $2, $3, $4, $5, true) RETURNING id, imie, nazwisko, email, rola, haslo",
            [imie, nazwisko, email, tempPassword, rola]
        );

        res.status(201).send({
            ...result.rows[0],
            wygenerowane_haslo: tempPassword
        });

    } catch (err) {
        console.error("Błąd przy rejestracji:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

// ZMIANA HASŁA
router.post("/change-password", async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query(
            "UPDATE pracownicy_tb SET haslo = $1, haslo_tymczasowe = false WHERE id = $2",
            [hashed, userId]
        );
        res.send({ msg: "Hasło zmienione pomyślnie" });
    } catch (err) {
        console.error("Błąd przy zmianie hasła:", err);
        res.status(500).send({ msg: "Błąd serwera" });
    }
});

export default router;