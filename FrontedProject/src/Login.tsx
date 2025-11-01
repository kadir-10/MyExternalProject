import React, { useState } from "react";
import axios from "./lib/axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await axios.post("/auth/login", { username, password });
            const token = res.data.token;
            localStorage.setItem("token", token);
            setMsg("Giriş başarılı — Hoşgeldin!");
            // redirect to protected page (example)
            window.location.href = "/protected";
        } catch (err: any) {
            setMsg(err?.response?.data?.error || "Giriş başarısız");
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "60px auto" }}>
            <h2>Giriş</h2>
            <form onSubmit={onSubmit}>
                <input placeholder="Kullanıcı" value={username} onChange={e => setUsername(e.target.value)} />
                <input placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} type="password" />
                <button type="submit">Giriş</button>
            </form>
            {msg && <p>{msg}</p>}
        </div>
    );
}
