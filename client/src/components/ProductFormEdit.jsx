import { useApp } from "../hooks/useApp"
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function ProductFormEdit() {
    const { allCategories, userCategories, updateProduct, activeCategoryId, setActiveCategoryId } = useApp(); 
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
        const product = userCategories.flatMap(cat => cat.products).find(p => p.id === parseInt(id)); 
        if (product) {
            setFormData(product)
        }
    }, [id, userCategories]);

    async function onUpdateSubmit(e) {
        e.preventDefault();
        
        const updatedProduct = {
            name: formData.name,
            rack: formData.rack,
            bin: formData.bin
        };
         
        // Just use formData.id directly
        const response = await updateProduct({ id: formData.id }, updatedProduct);

        if (response.success) {
            setActiveCategoryId(formData.category_id);
            navigate('/');
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={onUpdateSubmit}>
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
            <p>Category: {allCategories.find(c => c.id === formData.category_id)?.name}</p>
            
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
            
            <button type='submit'>Confirm Your Changes</button>
        </form>
    )
}