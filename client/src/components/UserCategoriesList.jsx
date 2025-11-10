import { useApp } from "../hooks/useApp";
import { ProductItem } from "./ProductItem";
import './UserCategoriesList.css'

export function UserCategoriesList() {
    const { userCategories, activeCategoryId, setActiveCategoryId, deleteProduct } = useApp();

    const onCategoryClick = (category) => {
        setActiveCategoryId(prevId => prevId === category.id ? null : category.id); 
    };
    
    return (
        <div className="categories-container">
            <ul>
                {userCategories
                .slice() 
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => {
                    const isVisible = category.id === activeCategoryId;
                    
                    return (
                        <li key={category.id}>
                            <button 
                                type='button' 
                                onClick={() => onCategoryClick(category)}
                                className={isVisible ? 'active' : ''}
                            >
                                <span>{category.name}</span>
                                <span className="item-count">
                                    {category.products?.length || 0} items
                                </span>
                            </button>
                            {isVisible && (
                                <ul>
                                    {category.products && category.products.length > 0 ? (
                                        category.products.map((product) => (
                                           <ProductItem 
                                               key={product.id} 
                                               product={product} 
                                               deleteProduct={deleteProduct}
                                           />
                                        ))
                                    ) : (
                                        <li className="no-products">
                                            No products found.
                                        </li>
                                    )}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}