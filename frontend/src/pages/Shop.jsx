import { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { API } from "../config/api";
import "./Shop.css";

const Shop = () => {
  const [products,       setProducts]       = useState([]);
  const [categories,     setCategories]     = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [search,         setSearch]         = useState("");
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    fetch(`${API}/products/Products.php`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        const cats = ["Tous", ...new Set(data.map((p) => p.category).filter(Boolean))];
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // useMemo au lieu de useEffect + setState pour le filtrage
  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== "Tous") result = result.filter((p) => p.category === activeCategory);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [activeCategory, search, products]);

  return (
    <div className="page">
      <h1 className="shop-title">Notre boutique</h1>

      <div className="shop-controls">
        <input
          type="text"
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="shop-search"
        />
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="loading">Chargement des produits...</p>
      ) : filtered.length === 0 ? (
        <p className="loading">Aucun produit trouvé.</p>
      ) : (
        <div className="grid-3">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Shop;