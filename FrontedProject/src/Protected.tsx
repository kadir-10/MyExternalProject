import React, { useEffect, useState } from "react";
import axios from "./lib/axios";

export default function Protected() {
    const [data, setData] = useState<any>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("/protected");
                setData(res.data);
            } catch (e: any) {
                setErr("Erişim reddedildi — lütfen giriş yapın");
                // redirect to login
                setTimeout(() => window.location.href = "/", 1200);
            }
        })();
    }, []);

    if (err) return <div>{err}</div>;
    return <div>{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Yükleniyor..."}</div>;
}
