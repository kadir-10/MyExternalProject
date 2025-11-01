import axios from "axios";

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE || "http://localhost:5000")
});

// request interceptor: add token
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;


// import axios from "axios";

// const base = import.meta.env.VITE_API_BASE || "http://localhost:5000";
// const api = axios.create({
//     // Eğer VITE_API_BASE sonu / ile bitiyorsa temizle, sonra tek /api ekle
//     baseURL: base.replace(/\/+$/, '') + "/api"
// });

// // request interceptor: add token
// api.interceptors.request.use(config => {
//     const token = localStorage.getItem("token");
//     if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });

// export default api;
