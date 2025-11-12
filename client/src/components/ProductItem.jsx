import { useNavigate } from "react-router-dom";

export function ProductItem({ product, deleteProduct }) {
  const navigate = useNavigate();

  // You can destructure for readability – it's safe
  const { id, name, rack, bin } = product;

  // 💡 New function to handle confirmation and deletion
  const handleDeleteClick = () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the product: ${name}? This action cannot be undone.`
    );

    if (isConfirmed) {
      deleteProduct(id);
    }
  };

  return (
    <li className="product-item">
      <div className="product-details">
        <span className="product-name">{name}</span>
        <span className="product-location">{`R: ${rack} / B: ${bin}`}</span>

        <button onClick={() => navigate(`/products/${id}`)}>View</button>
        <button onClick={() => navigate(`/products/${id}/edit`)}>Edit</button>
        

        <button onClick={handleDeleteClick}>Delete</button> 
      </div>
    </li>
  );
}