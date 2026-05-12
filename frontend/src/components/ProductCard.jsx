import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img
          src={product.image || "https://via.placeholder.com/300x200?text=Produit"}
          alt={product.name}
        />
        {product.stock === 0 && <span className="badge-rupture">Rupture</span>}
        {product.category && <span className="badge-cat">{product.category}</span>}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">{parseFloat(product.price).toFixed(2)} Fcfa</span>
          <span className="product-stock">Stock : {product.stock}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;