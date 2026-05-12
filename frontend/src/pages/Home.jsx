import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { API } from "../config";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`${API}/products/products.php`)
      .then((r) => r.json())
      .then((data) => setProducts(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">🌿 Produits frais &amp; locaux</p>
          <h1>Bienvenue chez<br /><span>MiniMarket</span></h1>
          <p className="hero-sub">Des produits de qualité, sélectionnés avec soin auprès de producteurs locaux.</p>
          <div className="hero-btns">
            <Link to="/shop" className="btn-primary btn-lg">Voir la boutique</Link>
            <Link to="/blog" className="btn-secondary btn-lg">Notre blog</Link>
          </div>
        </div>
        <div className="hero-visual">🥦</div>
      </section>

      {/* Produits vedettes */}
      <section className="page">
        <div className="section-header">
          <h2>Nos produits du moment</h2>
          <Link to="/shop" className="btn-secondary">Tout voir →</Link>
        </div>
        {loading ? (
          <p className="loading">Chargement...</p>
        ) : (
          <div className="grid-3">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Bandeau valeurs */}
      <section className="values">
        <div className="value-item"><span>🌱</span><h3>Local</h3><p>Producteurs de la région</p></div>
        <div className="value-item"><span>🤝</span><h3>Équitable</h3><p>Prix justes pour tous</p></div>
        <div className="value-item"><span>🍃</span><h3>Bio</h3><p>Sans pesticides</p></div>
        <div className="value-item"><span>🚚</span><h3>Frais</h3><p>Livraison rapide</p></div>
      </section>
    </div>
  );
};

export default Home;