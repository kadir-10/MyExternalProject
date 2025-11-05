import React, { useState } from "react";
import api from "../lib/axios";
import { Button } from "@/components/ui/button";

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
        <div className="max-w-md mx-auto mt-16 p-6 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Giriş</h2>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <input 
                        placeholder="Kullanıcı" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <input 
                        placeholder="Şifre" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <Button type="submit" className="w-full">
                    Giriş
                </Button>
            </form>
            {msg && <p className="mt-4 text-sm text-center">{msg}</p>}
        </div>
    );
}
