import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../hooks/useApp";

export function ProductFormNew() {
    const { allCategories, createProduct } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        rack: '',
        bin: ''
    });

    const navigate = useNavigate();


const catagoryData = allCategories.map((category) => {
    return (
        <option key={category.id} value={category.id}>{category.name}</option>
    )
})

const onFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

async function onCreateNew(e) {
    e.preventDefault();
    const newProduct = {
        name: formData.name,
        category_id: parseInt(formData.category_id),
        rack: formData.rack,
        bin: formData.bin,
    }
    await createProduct(newProduct)
    navigate('/')
    onClear()
}

function onClear() {
    setFormData({
        name: '',
        category_id: '',
        rack: '',
        bin: ''
    });
}

    return (
<>
<form onSubmit={onCreateNew}>
    <label htmlFor="name">Name: </label>
    <input type="text" id="name" name="name" placeholder="Name goes here..." onChange={onFormChange} value={formData.name} required />
    <label htmlFor="category_id">Category: </label>
    <select id="category_id" name="category_id" onChange={onFormChange} value={formData.category_id} required>
        <option value="">Select a category</option>
        {catagoryData}
    </select>
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