import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/Useauth";
import { API } from "../../config/api";
import "./Admin.css";

const empty = { name: "", description: "", price: "", image: "", stock: "", category: "" };

const AdminProducts = () => {
  const { user }                 = useAuth();
  const [products, setProducts]  = useState([]);
  const [form, setForm]          = useState(empty);
  const [editId, setEditId]      = useState(null);
  const [msg, setMsg]            = useState({ text: "", type: "" });
  const [loading, setLoading]    = useState(true);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    fetch(`${API}/products/Products.php`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchProducts);
  }, [fetchProducts]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url    = editId ? `${API}/products/Product.php?id=${editId}` : `${API}/products/Products.php`;
    const method = editId ? "PUT" : "POST";
    const res    = await fetch(url, { method, credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data   = await res.json();
    if (res.ok) {
      setMsg({ text: editId ? "Modifié ✓" : "Ajouté ✓", type: "success" });
      setForm(empty);
      setEditId(null);
      fetchProducts();
    } else {
      setMsg({ text: data.error || "Erreur", type: "error" });
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description || "", price: p.price, image: p.image || "", stock: p.stock, category: p.category || "" });
    setEditId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    const res  = await fetch(`${API}/products/Product.php?id=${id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (res.ok) { setMsg({ text: "Supprimé", type: "success" }); fetchProducts(); }
    else setMsg({ text: data.error, type: "error" });
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestion des produits</h1>
        <span className="admin-badge">👤 {user?.name}</span>
      </div>

      {msg.text && <p className={msg.type === "success" ? "success-msg" : "error-msg"}>{msg.text}</p>}

      <div className="admin-form-card">
        <h2>{editId ? "✏️ Modifier le produit" : "➕ Ajouter un produit"}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group"><label>Nom *</label><input name="name" value={form.name} onChange={handleChange} required /></div>
            <div className="form-group"><label>Prix (Fcfa) *</label><input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required /></div>
            <div className="form-group"><label>Stock</label><input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} /></div>
          </div>
          <div className="form-group"><label>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={2} /></div>
          <div className="form-row">
            <div className="form-group"><label>Image (URL)</label><input name="image" value={form.image} onChange={handleChange} /></div>
            <div className="form-group"><label>Catégorie</label><input name="category" value={form.category} onChange={handleChange} /></div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editId ? "Modifier" : "Ajouter"}</button>
            {editId && <button type="button" className="btn-secondary" onClick={() => { setForm(empty); setEditId(null); }}>Annuler</button>}
          </div>
        </form>
      </div>

      <div className="admin-table-wrap">
        {loading ? <p className="loading">Chargement...</p> : (
          <table className="admin-table">
            <thead><tr><th>Nom</th><th>Prix</th><th>Stock</th><th>Catégorie</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{parseFloat(p.price).toFixed(2)} Fcfa</td>
                  <td><span className={p.stock == 0 ? "stock-zero" : ""}>{p.stock}</span></td>
                  <td>{p.category || "—"}</td>
                  <td className="table-actions">
                    <button className="btn-secondary" onClick={() => handleEdit(p)}>✏️ Modifier</button>
                    <button className="btn-danger" onClick={() => handleDelete(p.id)}>🗑️ Supprimer</button>
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

export default AdminProducts;