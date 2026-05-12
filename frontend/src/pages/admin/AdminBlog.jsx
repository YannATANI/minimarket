import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/Useauth";
import { API } from "../../config/api";
import "./Admin.css";

const empty = { title: "", content: "", image: "", author: "", category: "" };

const AdminBlog = () => {
  const { user }                 = useAuth();
  const [articles, setArticles]  = useState([]);
  const [form, setForm]          = useState(empty);
  const [editId, setEditId]      = useState(null);
  const [msg, setMsg]            = useState({ text: "", type: "" });
  const [loading, setLoading]    = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/blog/Articles.php`);
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchArticles);
  }, [fetchArticles]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url    = editId ? `${API}/blog/Article.php?id=${editId}` : `${API}/blog/Articles.php`;
    const method = editId ? "PUT" : "POST";
    const payload = { ...form, author: form.author || user?.name || "" };
    const res    = await fetch(url, { method, credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data   = await res.json();
    if (res.ok) {
      setMsg({ text: editId ? "Modifié ✓" : "Publié ✓", type: "success" });
      setForm({ ...empty, author: user?.name || "" });
      setEditId(null);
      fetchArticles();
    } else {
      setMsg({ text: data.error || "Erreur", type: "error" });
    }
  };

  const handleEdit = (a) => {
    setForm({ title: a.title, content: a.content, image: a.image || "", author: a.author, category: a.category || "" });
    setEditId(a.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    const res  = await fetch(`${API}/blog/Article.php?id=${id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (res.ok) { setMsg({ text: "Supprimé", type: "success" }); fetchArticles(); }
    else setMsg({ text: data.error, type: "error" });
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestion du blog</h1>
        <span className="admin-badge">👤 {user?.name}</span>
      </div>

      {msg.text && <p className={msg.type === "success" ? "success-msg" : "error-msg"}>{msg.text}</p>}

      <div className="admin-form-card">
        <h2>{editId ? "✏️ Modifier l'article" : "➕ Nouvel article"}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group"><label>Titre *</label><input name="title" value={form.title} onChange={handleChange} required /></div>
            <div className="form-group"><label>Auteur *</label><input name="author" value={form.author || user?.name || ""} onChange={handleChange} required /></div>
          </div>
          <div className="form-group"><label>Contenu *</label><textarea name="content" value={form.content} onChange={handleChange} rows={5} required /></div>
          <div className="form-row">
            <div className="form-group"><label>Image (URL)</label><input name="image" value={form.image} onChange={handleChange} /></div>
            <div className="form-group"><label>Catégorie</label><input name="category" value={form.category} onChange={handleChange} /></div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editId ? "Modifier" : "Publier"}</button>
            {editId && <button type="button" className="btn-secondary" onClick={() => { setForm({ ...empty, author: user?.name || "" }); setEditId(null); }}>Annuler</button>}
          </div>
        </form>
      </div>

      <div className="admin-table-wrap">
        {loading ? <p className="loading">Chargement...</p> : (
          <table className="admin-table">
            <thead><tr><th>Titre</th><th>Auteur</th><th>Catégorie</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.title}</strong></td>
                  <td>{a.author}</td>
                  <td>{a.category || "—"}</td>
                  <td>{new Date(a.created_at).toLocaleDateString("fr-FR")}</td>
                  <td className="table-actions">
                    <button className="btn-secondary" onClick={() => handleEdit(a)}>✏️ Modifier</button>
                    <button className="btn-danger" onClick={() => handleDelete(a.id)}>🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;