import { useNavigate } from "react-router-dom";

export function ProductItem({ product, deleteProduct }) {
    const navigate = useNavigate();
    

    const { id, name, rack, bin } = product; 

    return (
  
        <li className="product-item">
   
            <div className="product-details">
                <span className="product-name">{name}</span>
                <span className="product-location">{`R: ${rack} / B: ${bin}`}</span>
    
      

                <button 
                    onClick={() => navigate(`/products/${id}`)}
                    className="action-view"
                >
                    View
                </button>
                <button 
                    onClick={() => navigate(`/products/${id}/edit`)}
                    className="action-edit"
                >
                    Edit
                </button>
                <button 
                    onClick={() => deleteProduct(product.id)}
                    className="action-delete"
                >
                    Delete
                </button>
               </div>
        </li>
    );
}
