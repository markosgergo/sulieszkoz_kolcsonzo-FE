import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

const ApiService = {
  // AUTH
  login: async (email, jelszo) => {
    const response = await api.post("/auth/login", { email, jelszo });
    return response.data;
  },

  register: async (felhasznaloAdat) => {
  // Az api példányod már tartalmazza az /api-t, így elég a /felhasznalok
  const response = await api.post("/felhasznalok", felhasznaloAdat); 
  return response.data;
},

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // ESZKOZOK
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

  getEszkozQrCode: async (id) => {
    const response = await api.get(`/eszkozok/${id}/qrcode`, {
      responseType: "blob",
    });
    return response.data;
  },

  // FELHASZNALOK
  getAllFelhasznalo: async () => {
    const response = await api.get("/felhasznalok");
    return response.data;
  },

  getFelhasznaloById: async (id) => {
    const response = await api.get(`/felhasznalok/${id}`);
    return response.data;
  },

  createFelhasznalo: async (felhasznaloAdat) => {
    const response = await api.post("/felhasznalok", felhasznaloAdat);
    return response.data;
  },

  deleteFelhasznalo: async (id) => {
    const response = await api.delete(`/felhasznalok/${id}`);
    return response.data;
  },

  // KOLCSONZESEK
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