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
    const [ originalProduct, setOriginalProduct ] = useState({
        id: '',
        name: '',
        category_id: '',
        rack: '',
        bin: ''
    })
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const originalProduct = userCategories.flatMap(cat => cat.products).find(p => p.id === parseInt(id)); 
        if (originalProduct) {
            setOriginalProduct(originalProduct)
            setFormData(originalProduct)
        }
    }, [id, userCategories]);

async function onUpdateSubmit(e) {
    e.preventDefault();
    
    const updatedProduct = {
        id: formData.id,
        name: formData.name,
        category_id: formData.category_id,
        rack: formData.rack,
        bin: formData.bin
    };
     
    const response = await updateProduct(originalProduct, updatedProduct);

    if (response.success) {
        setActiveCategoryId(formData.category_id);
        setFormData({
            id: '',
            name: '',
            category_id: '',
            rack: '',
            bin: ''
        });
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