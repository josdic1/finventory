import { useApp } from "../hooks/useApp"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function NewCategoryForm() {
    const { allCategories, fetchAllCategories, createCategory, setActiveCategoryId } = useApp();
    const [ formData, setFormData ] = useState({
        name: ''
    })
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllCategories();
      }, []);

      if (allCategories.length === 0) {
        return <h2>Loading Categories...</h2>; 
    }

    const onFormChange = (e) => {
        setFormData(prev => ({
            ...prev, 
            name: e.target.value
        }))
    }

    const onCreateCategory = async (e) => {
        e.preventDefault();
        if(allCategories.length > 0) {
            const duplicate = allCategories.find(c => (
                c.name.toLowerCase() === formData.name.toLowerCase()
            ))
            if (duplicate?.name) {
        alert('That category exists, please try again')
    } else {
        const categoryData = { name: formData.name };
               const newCategoryObject = await createCategory(categoryData)
               setActiveCategoryId(parseInt(newCategoryObject.id))
                navigate('/products/new')
            }
        } else {
            console.log('No categories available')
        }

    
    }


    return (
        <>
        <form onSubmit={onCreateCategory}>
        <label htmlFor="name">Name: </label>
        <input type='text' onChange={onFormChange} value={formData.name} placeholder='New category'/>
        <button type='submit'> Add </button>
        </form>
        </>
    )
}