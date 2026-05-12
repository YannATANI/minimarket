import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../config/api";
import "./Article.css";

const Article = () => {
  const { id }               = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch(`${API}/blog/Article.php?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setArticle(data);
      })
      .catch(() => setError("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="loading">Chargement...</p>;
  if (error)   return <div className="page"><p className="error-msg">{error}</p><Link to="/blog">← Retour</Link></div>;

  return (
    <div className="page article-page">
      <Link to="/blog" className="back-link">← Retour au blog</Link>
      {article.image && (
        <img src={article.image} alt={article.title} className="article-hero-img" />
      )}
      <div className="article-header">
        {article.category && <span className="article-tag">{article.category}</span>}
        <h1>{article.title}</h1>
        <div className="article-meta-detail">
          <span>✍️ {article.author}</span>
          <span>{new Date(article.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>
      <div className="article-content">
        {article.content.split("\n").map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  );
};

export default Article;