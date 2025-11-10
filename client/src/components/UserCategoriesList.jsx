import { useApp } from "../hooks/useApp";

import { ProductItem } from "./ProductItem";

export function UserCategoriesList() {
    const { userCategories, activeCategoryId, setActiveCategoryId, deleteProduct } = useApp();


    const onCategoryClick = (category) => {
        setActiveCategoryId(prevId => prevId === category.id ? null : category.id); 
    };
    
return (
        <div>
            <h1>Categories</h1>
            <ul>
                {userCategories.map((category) => {
    
                    const isVisible = category.id === activeCategoryId;
                    
                    return (
                        <li key={category.id}>
                            <button 
                                type='button' 
                                id={category.id} 
                                onClick={() => onCategoryClick(category)}
                        
                                style={{ fontWeight: isVisible ? 'bold' : 'normal' }}
                            >
                                {category.name}
                            </button>
                            {isVisible && (
                                <ul>
                                    {category.products && category.products.length > 0 ? (
                                        category.products.map((product) => (
                                           <ProductItem key={product.id} product={product} productName={product.name} deleteProduct={deleteProduct}/>
                                        ))
                                    ) : (
                                        <li>No products found.</li>
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