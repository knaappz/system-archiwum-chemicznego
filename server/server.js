import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import samplesRoutes from "./routes/samples.js";
import dictionaryRoutes from "./routes/dictionary.js";
import ordersRoutes from './routes/orders.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Rejestracja tras
app.use("/api/data", samplesRoutes);
app.use("/api", authRoutes);
app.use("/api", dictionaryRoutes);
app.use("/api/orders", ordersRoutes);

// Nasłuchiwanie
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
