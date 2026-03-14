import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await ApiService.login(email, jelszo);
      navigate("/");
    } catch (err) {
      alert("Hibás bejelentkezés");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Bejelentkezés</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Jelszó"
        value={jelszo}
        onChange={(e) => setJelszo(e.target.value)}
      />

      <button type="submit">Belépés</button>
    </form>
  );
}