import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      if (!url.includes("/auth/me") && !url.includes("/auth/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const ApiService = {

  login: async (email, jelszo) => {
    const response = await api.post("/auth/login", { email, jelszo });
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


  register: async (felhasznaloAdat) => {
    const response = await api.post("/felhasznalok", felhasznaloAdat);
    return response.data;
  },

  getAllFelhasznalo: async () => {
    const response = await api.get("/felhasznalok");
    return response.data;
  },

  getFelhasznaloById: async (id) => {
    const response = await api.get(`/felhasznalok/${id}`);
    return response.data;
  },

  keresesNevAlapjan: async (nev) => {
    const response = await api.get("/felhasznalok/kereses", { params: { nev } });
    return response.data;
  },

  deleteFelhasznalo: async (id) => {
    const response = await api.delete(`/felhasznalok/${id}`);
    return response.data;
  },

  modositJelszo: async (id, jelszoAdatok) => {
    const response = await api.put(`/felhasznalok/${id}/jelszo`, jelszoAdatok);
    return response.data;
  },

  modositSzerepkor: async (id, ujSzerepkor) => {
    const response = await api.put(`/felhasznalok/${id}/szerepkor`, { ujSzerepkor });
    return response.data; 
  },

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
    return URL.createObjectURL(response.data);
  },

  getAllKolcsonzes: async () => {
    const response = await api.get("/kolcsonzesek");
    return response.data;
  },

  getKiadasraVaroKerelmek: async () => {
    const response = await api.get("/kolcsonzesek/kiadasra-var");
    return response.data;
  },

  elfogadKiadasKerelem: async (id) => {
    const response = await api.put(`/kolcsonzesek/${id}/elfogadas`);
    return response.data;
  },

  elutasitKiadasKerelem: async (id) => {
    const response = await api.delete(`/kolcsonzesek/${id}/elutasitas`);
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

  visszavetelByEszkozId: async (eszkozId) => {
    const response = await api.put(`/kolcsonzesek/visszavetel/eszkoz/${eszkozId}`);
    return response.data;
  },
};

export default ApiService;
