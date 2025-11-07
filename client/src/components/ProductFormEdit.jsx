import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../hooks/useApp";

export function ProductFormEdit() {
    const { selectedCategoryId, userCategories, updateProduct } = useApp();
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        category_id: '',
        rack: '',
        bin: ''
    });
    const [originalCategoryId, setOriginalCategoryId] = useState(null); // Track original category

    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
        const found = userCategories.find(category => category.id === selectedCategoryId);
        if (found) {
            const product = found.products.find(product => product.id === parseInt(id));
            if (product) {
                setFormData({
                    id: product.id,
                    name: product.name,
                    category_id: product.category_id,
                    rack: product.rack,
                    bin: product.bin
                });
                setOriginalCategoryId(product.category_id); // Store the original category ID
            }
        }
    }, [id, userCategories, selectedCategoryId]);

    const onFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    async function onUpdate(e) {
        e.preventDefault();
        const updatedProduct = {
            ...formData,
            name: formData.name,
            category_id: parseInt(formData.category_id),
            rack: formData.rack,
            bin: formData.bin,
        };
        await updateProduct(updatedProduct, originalCategoryId); // Use originalCategoryId here
        navigate('/');
        onClear();
    }

    function onClear() {
        setFormData({
            id: '',
            name: '',
            category_id: '',
            rack: '',
            bin: ''
        });
    }

    return (
        <>
            <form onSubmit={onUpdate}>
                <label htmlFor="name">Name: </label>
                <input type="text" id="name" name="name" placeholder="Name goes here..." onChange={onFormChange} value={formData.name} required />
                <label htmlFor="category_id">Category: </label>
                <input type="text" id="category_id" name="category_id" placeholder="Category goes here..." onChange={onFormChange} value={formData.category_id} disabled /> 
                <label htmlFor="rack">Rack: </label>
                <input type="text" id="rack" name="rack" placeholder="Rack goes here..." onChange={onFormChange} value={formData.rack} />   
                <label htmlFor="bin">Bin: </label>
                <input type="text" id="bin" name="bin" placeholder="Bin goes here..." onChange={onFormChange} value={formData.bin} /> 
                <button type="submit">Submit</button>
                <button type="button" onClick={onClear}>Reset</button>
            </form>
        </>
    );
}