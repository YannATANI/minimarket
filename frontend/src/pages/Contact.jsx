import { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Tous les champs sont requis.");
      return;
    }
    // Simulation d'envoi (à relier à un vrai endpoint PHP si besoin)
    setSuccess(true);
    setError("");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="page contact-page">
      <div className="contact-grid">
        <div className="contact-info">
          <h1>Contactez-nous</h1>
          <p>Une question, une suggestion ? On vous répond dans les 24h.</p>
          <ul className="contact-details">
            <li>📍 12 rue du Marché, 75001 Paris</li>
            <li>📞 01 23 45 67 89</li>
            <li>✉️ contact@minimarket.fr</li>
            <li>🕐 Lun–Sam : 8h–19h</li>
          </ul>
        </div>

        <div className="contact-form-wrap">
          {success && <p className="success-msg">✓ Message envoyé ! On vous recontacte bientôt.</p>}
          {error   && <p className="error-msg">{error}</p>}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Nom</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="votre@email.fr" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Votre message..." />
            </div>
            <button type="submit" className="btn-primary">Envoyer le message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;