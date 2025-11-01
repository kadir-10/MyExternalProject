import React, { useEffect, useState } from "react";
import api from "../lib/axios";

export default function Protected() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/protected");
                setData(res.data);
            } catch {
                // token yok/invalid ise login'e yönlendir
                window.location.href = "/";
            }
        })();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h3>Protected</h3>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <div>Yükleniyor...</div>}
        </div>
    );
}
