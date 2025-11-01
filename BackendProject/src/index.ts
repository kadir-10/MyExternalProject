import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "./db";
import cors from "cors";

dotenv.config();
const app = express();


app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "very_secret_change_me";

// simple login endpoint
app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "username/password required" });

    try {
        const client = await pool.connect();
        const result = await client.query("SELECT id, username, password_hash FROM users WHERE username = $1", [username]);
        client.release();

        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

// protected route example
app.get("/api/protected", async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "No token" });
    const parts = auth.split(" ");
    if (parts.length !== 2) return res.status(401).json({ error: "Invalid token" });
    const token = parts[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        res.json({ message: "Hoşgeldin", payload });
    } catch (e) {
        res.status(401).json({ error: "Invalid token" });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
