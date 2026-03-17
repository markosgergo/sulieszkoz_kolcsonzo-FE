import axios from "axios";

// Axios példány létrehozása alapbeállításokkal
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

/**
 * FONTOS: REQUEST INTERCEPTOR
 * Ez minden kimenő kérés elé "beáll", és ha talál tokent a localStorage-ban,
 * azt automatikusan belerakja az Authorization fejlécbe.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * OPTIONAL: RESPONSE INTERCEPTOR
 * Ha a token lejár és a backend 401-et dob, automatikusan kiléptet.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  // --- AUTHENTICATION ---
  login: async (email, jelszo) => {
    const response = await api.post("/auth/login", { email, jelszo });
    return response.data;
  },

  register: async (felhasznaloAdat) => {
    // Itt a backend DTO-nak megfelelő mezőket küldjük (szerepkorNev, stb.)
    const response = await api.post("/felhasznalok", felhasznaloAdat);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
    }
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // --- ESZKOZOK ---
  getAllEszkoz: async () => {
    const response = await api.get("/eszkozok");
    return response.data;
  },

  getEszkozById: async (id) => {
    const response = await api.get(`/eszkozok/${id}`);
    return response.data;
  },

  createEszkoz: async (eszkozAdat) => {
    const response = await api.post("/eszkozok", eszkozAdat);
    return response.data;
  },

  updateEszkoz: async (id, eszkozAdat) => {
    const response = await api.put(`/eszkozok/${id}`, eszkozAdat);
    return response.data;
  },

  deleteEszkoz: async (id) => {
    const response = await api.delete(`/eszkozok/${id}`);
    return response.data;
  },

  getSzabadEszkozok: async () => {
    const response = await api.get("/eszkozok/szabad");
    return response.data;
  },

  // --- FELHASZNALOK ---
  getAllFelhasznalo: async () => {
    const response = await api.get("/felhasznalok");
    return response.data;
  },

  getFelhasznaloById: async (id) => {
    const response = await api.get(`/felhasznalok/${id}`);
    return response.data;
  },

  deleteFelhasznalo: async (id) => {
    const response = await api.delete(`/felhasznalok/${id}`);
    return response.data;
  },

  // --- KOLCSONZESEK ---
  getAllKolcsonzes: async () => {
    const response = await api.get("/kolcsonzesek");
    return response.data;
  },

  getSajatKolcsonzesek: async () => {
    const response = await api.get("/kolcsonzesek/sajat");
    return response.data;
  },

  getKesesbenLevoKolcsonzesek: async () => {
    const response = await api.get("/kolcsonzesek/kesesben");
    return response.data;
  },

  createKolcsonzes: async (kolcsonzesAdat) => {
    const response = await api.post("/kolcsonzesek", kolcsonzesAdat);
    return response.data;
  },

  visszavetel: async (id) => {
    const response = await api.put(`/kolcsonzesek/${id}/visszavetel`);
    return response.data;
  },
};

export default ApiService;