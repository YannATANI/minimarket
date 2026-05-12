import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../config";
import "./Blog.css";
import "./Blog.css";

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`${API}/blog/articles.php`)
      .then((r) => r.json())
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h1 className="blog-title">Le Blog</h1>
      <p className="blog-sub">Actualités, recettes et conseils de notre équipe.</p>

      {loading ? (
        <p className="loading">Chargement...</p>
      ) : articles.length === 0 ? (
        <p className="loading">Aucun article pour le moment.</p>
      ) : (
        <div className="grid-2">
          {articles.map((a) => (
            <Link to={`/blog/${a.id}`} key={a.id} className="article-card">
              <div className="article-img">
                <img src={a.image || "https://via.placeholder.com/600x300?text=Article"} alt={a.title} />
                {a.category && <span className="article-cat">{a.category}</span>}
              </div>
              <div className="article-body">
                <h2>{a.title}</h2>
                <p>{a.content.substring(0, 100)}…</p>
                <div className="article-meta">
                  <span>✍️ {a.author}</span>
                  <span>{new Date(a.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;