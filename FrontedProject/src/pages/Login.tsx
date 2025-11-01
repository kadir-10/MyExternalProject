import React, { useState } from "react";
import api from "../lib/axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { username, password });
            const token = res.data.token;
            localStorage.setItem("token", token);
            setMsg("Giriş başarılı — yönlendiriliyorsunuz...");
            setTimeout(() => (window.location.href = "/protected"), 600);
        } catch (err: any) {
            setMsg(err?.response?.data?.error || "Giriş başarısız");
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "60px auto" }}>
            <h2>Giriş</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <input placeholder="Kullanıcı" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div style={{ marginTop: 8 }}>
                    <input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div style={{ marginTop: 12 }}>
                    <button type="submit">Giriş</button>
                </div>
            </form>
            {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
        </div>
    );
}
