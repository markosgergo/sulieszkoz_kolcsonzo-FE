import axios from "axios";

// Axios példány létrehozása alapbeállításokkal
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

/**
 * REQUEST INTERCEPTOR: Automatikusan hozzáadja a JWT tokent minden kéréshez
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR: Kezeli a lejárt munkamenetet (401 hiba)
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
  // --- AUTHENTICATION (Hitelesítés) ---
  login: async (email, jelszo) => {
    const response = await api.post("/auth/login", { email, jelszo });
    return response.data;
  },

  register: async (felhasznaloAdat) => {
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

  // --- ESZKOZOK (Eszközök kezelése) ---
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

  /**
   * BIZTONSÁGOS QR KÓD LEKÉRÉS:
   * Mivel a backend auth-ot kér, bináris adatként (blob) hívjuk le.
   */
  getEszkozQrCode: async (id) => {
    const response = await api.get(`/eszkozok/${id}/qrcode`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  },

  // --- FELHASZNALOK (Adminisztráció) ---
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

  // --- KOLCSONZESEK (Kölcsönzési folyamat) ---
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

  // Visszavétel konkrét kölcsönzés ID alapján
  visszavetel: async (id) => {
    const response = await api.put(`/kolcsonzesek/${id}/visszavetel`);
    return response.data;
  },

  // Visszavétel eszköz ID alapján (ha a kezelő nem tudja a kölcsönzés ID-t)
  visszavetelByEszkozId: async (eszkozId) => {
    const response = await api.put(`/kolcsonzesek/visszavetel/eszkoz/${eszkozId}`);
    return response.data;
  }
};



export default ApiService;