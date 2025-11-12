import { useNavigate } from "react-router-dom";

export function ProductItem({ product, deleteProduct }) {
  const navigate = useNavigate();

  // You can destructure for readability – it's safe
  const { id, name, rack, bin } = product;

  return (
    <li className="product-item">
      <div className="product-details">
        <span className="product-name">{name}</span>
        <span className="product-location">{`R: ${rack} / B: ${bin}`}</span>

        <button onClick={() => navigate(`/products/${id}`)}>View</button>
        <button onClick={() => navigate(`/products/${id}/edit`)}>Edit</button>
        <button onClick={() => deleteProduct(id)}>Delete</button>
      </div>
    </li>
  );
}