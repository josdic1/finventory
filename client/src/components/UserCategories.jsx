// In UserCategories.jsx
import  {useApp} from "../hooks/useApp"
import { useNavigate } from "react-router-dom";

export function UserCategories({ categoriesToDisplay }) {
    const { setSelectedCategoryId, selectedCategoryId } = useApp();
    const navigate = useNavigate(); 
  



    const handleCategoryClick = (categoryId) => {
        setSelectedCategoryId(prevId => (prevId === categoryId ? null : categoryId));
    };

    if (!categoriesToDisplay || categoriesToDisplay.length === 0) {
        return <div className="categories"><h2>Categories</h2><p>No categories found.</p></div>;
    }

    return (
        <div className="categories">
            <h2>Categories</h2>
            <ul>
                {categoriesToDisplay.map((category) => (
                    <li key={category.id}>
    
                        <button
                            onClick={() => handleCategoryClick(category.id)}
                          
                            className={selectedCategoryId === category.id ? 'selected-category' : ''}
                        >
                            {category.name}
                        </button>

                     
                        {selectedCategoryId === category.id && (
                            <ul className="product-list">
                                {category.products && category.products.length > 0 ? (
                                    category.products.map((product) => (
                                        <li key={product.id}>
                                            <button onClick={() => navigate(`/products/${product.id}`)}>
                                                {product.name}
                                            </button>
                                            <button onClick={() => navigate(`/products/${product.id}/edit`)}>
                                                Edit
                                            </button>
                                            <button onClick={() => navigate(`/products/${product.id}/delete`)}>
                                                Delete
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li>No products in this category.</li>
                                )}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}