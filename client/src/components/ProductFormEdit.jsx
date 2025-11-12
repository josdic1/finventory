import { useApp } from "../hooks/useApp"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export function ProductFormEdit () {
 const { userCategories, fetchAllCategories, allCategories, updateProduct } = useApp()
 const { id } = useParams()
 const [ formData, setFormData ] = useState({
  id: '',
  name: '',
  rack: '',
  bin: '',
  category_id: ''
 })
  const [ originalProduct, setOriginalProduct ] = useState({
  id: '',
  name: '',
  rack: '',
  bin: '',
  category_id: ''
 })
const navigate = useNavigate()

 useEffect(() => {
  fetchAllCategories()
 },[])

useEffect(() => {
        if (userCategories && userCategories.length > 0 && id) {
            const allProducts = userCategories.flatMap(cat => cat.products || [])
            const selectedProduct = allProducts.find(product => product.id === parseInt(id))
            
            if (selectedProduct) {
                setFormData({
                    id: selectedProduct.id,
  name: selectedProduct.name,
  rack: selectedProduct.rack,
  bin: selectedProduct.bin,
  category_id: selectedProduct.category_id
                })
             setOriginalProduct(selectedProduct);
            }
        }
    }, [userCategories, id])




  const onFormChange = (e) => {
    const {name, value} = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const cat = allCategories.find(c => c.id === parseInt(formData.category_id));

  async function onUpdateProduct(e) {
    e.preventDefault()
    const updatedProductPayload = {
      id: parseInt(id),
      name: formData.name,
      rack: formData.rack,
      bin: formData.bin,
      category_id: parseInt(formData.category_id)
    }
    const result = await updateProduct(originalProduct, updatedProductPayload);
    
    if (result.success) {
        navigate('/');
        onClear();
    } else {
        alert("Update failed: " + (result.error || "Unknown error"));
    }
}

  function onClear() {
    setOriginalProduct({
      id: '',
      name: '',
      rack: '',
      bin: '',
      category_id: ''
    })
    setFormData({
      id: '',
      name: '',
      rack: '',
      bin: '',
      category_id: ''
    })
  }


  return (

     <>
    <form onSubmit={onUpdateProduct}>
      <label htmlFor="name">Name: </label>
      <input type="text" name='name' placeholder='Name' onChange={onFormChange} value={formData.name} />
<label htmlFor="category_id">Category: </label>
      <p className="category-display">
       {cat?.name || 'Loading...'} 
        </p>
      <label htmlFor="rack">Rack: </label>
      <input type="text" name='rack' placeholder='Rack' onChange={onFormChange} value={formData.rack} />
      <label htmlFor="bin">Bin: </label>
      <input type="text" name='bin' placeholder='Bin' onChange={onFormChange} value={formData.bin} />
      <button type='submit'> Update </button>
    </form>
    </>
  )
}