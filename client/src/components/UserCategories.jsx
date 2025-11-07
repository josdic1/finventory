// In UserCategories.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function UserCategories({ categoriesToDisplay }) {
    const navigate = useNavigate(); // Initialize navigate hook

    // State to keep track of the currently selected (open) category
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // This function will be called when a category button is clicked
    const handleCategoryClick = (categoryId) => {
        // If the same category is clicked again, close it (toggle)
        // Otherwise, open the new category
        setSelectedCategoryId(prevId => (prevId === categoryId ? null : categoryId));
    };

    // Add a check to ensure categoriesToDisplay is not null/undefined/empty
    if (!categoriesToDisplay || categoriesToDisplay.length === 0) {
        return <div className="categories"><h2>Categories</h2><p>No categories found.</p></div>;
    }

    return (
        <div className="categories">
            <h2>Categories</h2>
            <ul>
                {categoriesToDisplay.map((category) => (
                    <li key={category.id}>
                        {/* Category Name Button - opens/closes product list */}
                        <button
                            onClick={() => handleCategoryClick(category.id)}
                            // Add a class for styling if this category is currently selected
                            className={selectedCategoryId === category.id ? 'selected-category' : ''}
                        >
                            {category.name}
                        </button>

                        {/* Nested Product List */}
                        {/* Only show if this category is the selected one */}
                        {selectedCategoryId === category.id && (
                            <ul className="product-list"> {/* Add a class for styling nested list */}
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