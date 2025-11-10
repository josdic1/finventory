import { useApp } from "../hooks/useApp"
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function ProductFormEdit() {
    // Get setActiveCategoryId from the context along with others
    const { allCategories, userCategories, updateProduct, setActiveCategoryId } = useApp(); 
    const [ formData, setFormData ] = useState({
        id: '',
        name: '',
        category_id: '',
        rack: '',
        bin: ''
    })
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const productWithCategory = userCategories.flatMap(cat => 
            cat.products.map(p => ({ ...p, categoryName: cat.name }))
        ).find(p => p.id === parseInt(id));
        
        if (productWithCategory) {
            setFormData(productWithCategory);
        }
    }, [id, userCategories]);

async function onUpdateProduct(e) {
    e.preventDefault()
    const updatedProduct = {
        id: formData.id,
        name: formData.name,
        category_id: parseInt(formData.category_id),
        rack: formData.rack,
        bin: formData.bin
    }
     
    const response = await updateProduct(originalCategoryId, updatedProduct);
    
    if (response.success) {
        setActiveCategoryId(updatedProduct.category_id);
        setFormData({
            id: '',
            name: '',
            category_id: '',
            rack: '',
            bin: ''
        })
        
        navigate('/');
    }
}

const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

    return (
        <form onSubmit={onUpdateProduct}>
            <h2>Updating {formData.name}</h2>
            <label htmlFor="name">Name: </label>
            <input 
                type="text" 
                name="name" 
                id="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required
            />
            <label htmlFor="category_id">Category: </label>
            <select 
                name="category_id" 
                id="category_id" 
                value={formData.category_id} 
                onChange={handleInputChange}
                required
            >
                <option value="">Select a category</option>
                {allCategories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <label htmlFor="rack">Rack: </label>
            <input 
                type="text" 
                name="rack" 
                id="rack" 
                value={formData.rack} 
                onChange={handleInputChange} 
            />
            <label htmlFor="bin">Bin: </label>
            <input 
                type="text" 
                name="bin" 
                id="bin" 
                value={formData.bin} 
                onChange={handleInputChange} 
            />
            
            <button type='submit'> Confirm Your Changes</button>
        </form>
    )
}