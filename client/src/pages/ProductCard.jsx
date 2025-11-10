import { useApp } from "../hooks/useApp";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"

export function ProductCard() {
    const { userCategories } = useApp();
    const [thisProduct, setThisProduct] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const productWithCategory = userCategories.flatMap(cat => 
            cat.products.map(p => ({ ...p, categoryName: cat.name }))
        ).find(p => p.id === parseInt(id));
        
        if (productWithCategory) {
            setThisProduct(productWithCategory);
            setCategoryName(productWithCategory.categoryName);
        }
    }, [id, userCategories]);

    // Add this check before rendering
    if (!thisProduct) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Product Card</h1>
            <p>Name: {thisProduct.name}</p>
            <p>Category: {categoryName}</p>
            <p>Rack: {thisProduct.rack}</p>
            <p>Bin: {thisProduct.bin}</p>
            <button onClick={() => navigate('/')}>Back</button>
        </div>
    )
}