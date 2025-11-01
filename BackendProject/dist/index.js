"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("./db"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: ["http://localhost:5173"] }));
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "very_secret_change_me";
// simple login endpoint
app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: "username/password required" });
    try {
        const client = await db_1.default.connect();
        const result = await client.query("SELECT id, username, password_hash FROM users WHERE username = $1", [username]);
        client.release();
        const user = result.rows[0];
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const match = await bcrypt_1.default.compare(password, user.password_hash);
        if (!match)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token });
    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});
// protected route example
app.get("/api/protected", async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ error: "No token" });
    const parts = auth.split(" ");
    if (parts.length !== 2)
        return res.status(401).json({ error: "Invalid token" });
    const token = parts[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.json({ message: "Hoşgeldin", payload });
    }
    catch (e) {
        res.status(401).json({ error: "Invalid token" });
    }
});
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
