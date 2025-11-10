import { useApp } from "../hooks/useApp"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function ProductFormNew() {
    // Get setActiveCategoryId from the context along with others
    const { allCategories, createProduct, setActiveCategoryId } = useApp(); 
    const [ formData, setFormData ] = useState({
        name: '',
        category_id: '',
        rack: '',
        bin: ''
    })
    const navigate = useNavigate();

    async function onCreateProduct(e) {
        e.preventDefault()
        // Ensure category_id is an integer for API consistency
        const newProduct = {
            name: formData.name,
            category_id: parseInt(formData.category_id), // Convert to Int
            rack: formData.rack,
            bin: formData.bin
        }
        
        // Call the API function
        const response = await createProduct(newProduct);
        
        if (response.success) {
            // --- FIX: Activate the Category ---
            // This ensures the UserCategoriesList will show the products for this category
            // when it renders on the home page.
            setActiveCategoryId(newProduct.category_id);
            // ---------------------------------
            
            // Clear form (Optional but good practice)
            setFormData({
                name: '',
                category_id: '',
                rack: '',
                bin: ''
            })
            
            // Navigate back to the home page
            navigate('/');
        }
        // NOTE: You should add error handling here (e.g., if response.error exists)
    }

    // Handler for form input changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={onCreateProduct}>
            <h2>Create New Product</h2>
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
            
            <button type='submit'> Create New</button>
        </form>
    )
}