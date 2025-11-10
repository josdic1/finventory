import { useApp } from "../hooks/useApp";
import { ProductItem } from "./ProductItem";

export function UserCategoriesList() {
    const { userCategories, activeCategoryId, setActiveCategoryId, deleteProduct } = useApp();

    const onCategoryClick = (category) => {
        setActiveCategoryId(prevId => prevId === category.id ? null : category.id); 
    };
    
    return (
        <div style={{ padding: '20px' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {userCategories.map((category) => {
                    const isVisible = category.id === activeCategoryId;
                    
                    return (
                        <li key={category.id} style={{ marginBottom: '10px' }}>
                            <button 
                                type='button' 
                                onClick={() => onCategoryClick(category)}
                                style={{
                                    width: '100%',
                                    padding: '15px 20px',
                                    fontSize: '16px',
                                    fontWeight: isVisible ? '600' : '500',
                                    backgroundColor: isVisible ? '#2563eb' : '#f3f4f6',
                                    color: isVisible ? 'white' : '#1f2937',
                                    border: isVisible ? '2px solid #1d4ed8' : '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isVisible) {
                                        e.target.style.backgroundColor = '#e5e7eb';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isVisible) {
                                        e.target.style.backgroundColor = '#f3f4f6';
                                    }
                                }}
                            >
                                <span>{category.name}</span>
                                <span style={{ 
                                    fontSize: '12px', 
                                    opacity: 0.8 
                                }}>
                                    {category.products?.length || 0} items
                                </span>
                            </button>
                            {isVisible && (
                                <ul style={{ 
                                    listStyle: 'none', 
                                    padding: '10px 0 0 20px',
                                    margin: 0 
                                }}>
                                    {category.products && category.products.length > 0 ? (
                                        category.products.map((product) => (
                                           <ProductItem 
                                               key={product.id} 
                                               product={product} 
                                               deleteProduct={deleteProduct}
                                           />
                                        ))
                                    ) : (
                                        <li style={{ padding: '10px', color: '#6b7280' }}>
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