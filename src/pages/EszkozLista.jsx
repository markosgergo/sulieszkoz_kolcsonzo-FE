import { useEffect, useState } from "react";
import ApiService from "../services/ApiService";

export default function EszkozLista() {
  const [eszkozok, setEszkozok] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await ApiService.getAllEszkoz();
      setEszkozok(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Eszközök</h2>

      {eszkozok.map((eszkoz) => (
        <div key={eszkoz.id}>
          {eszkoz.nev}
        </div>
      ))}
    </div>
  );
}