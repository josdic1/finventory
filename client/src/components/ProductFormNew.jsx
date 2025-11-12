import { useApp } from "../hooks/useApp"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export function ProductFormNew() {
  const { allCategories, activeCategoryId, fetchAllCategories, createProduct, tempFormName, setTempFormName } = useApp();
  const [ formData, setFormData ] = useState({
    name: '',
    rack: '',
    bin: '',
    category_id: ''
  })
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCategories();
  }, []);

useEffect(() => {
        if (activeCategoryId) {
            setFormData(prev => ({
                ...prev, 
                category_id: parseInt(activeCategoryId)
            }));
          if(tempFormName) {
            setFormData(prev => ({
                ...prev, 
                name: tempFormName
            }));
          }
        }
    }, [activeCategoryId, tempFormName]);

const categoryList = allCategories.length > 0 ? (
  allCategories.map((c) => ( 
    <option key={c.id} value={c.id}> 
      {c.name}
    </option>
  ))
) : (
  <option disabled>No categories available</option> 
);

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

   setTempFormName(prev => {
    if (name === 'name') {
        return value;
    }
    return prev;
});
    
  }


  async function onCreateProduct(e) {
    e.preventDefault();
    const newProduct = {
      name: formData.name,
      rack: formData.rack,
      bin: formData.bin,
      category_id: formData.category_id
    }
    await createProduct(newProduct);
    navigate('/');
    onClear()
  }

   function onClear() {
    setFormData({
      name: '',
      rack: '',
      bin: '',
      category_id: ''
    });
  }

 
  return (
    <>
    <form onSubmit={onCreateProduct}>
      <label htmlFor="name">Name: </label>
      <input type="text" name='name' placeholder='Name' onChange={onFormChange} value={formData.name} />
      <label htmlFor="category_id">Category: </label>
      <select name='category_id' onChange={onFormChange} value={formData.category_id}>
      <option value="" disabled> Categories </option>
      {categoryList}
      </select>
      <p>Don't see your category? Add it <button type='button' onClick={() => navigate('/categories/new')}> HERE</button>
        </p>
      <label htmlFor="rack">Rack: </label>
      <input type="text" name='rack' placeholder='Rack' onChange={onFormChange} value={formData.rack} />
      <label htmlFor="bin">Bin: </label>
      <input type="text" name='bin' placeholder='Bin' onChange={onFormChange} value={formData.bin} />
      <button type='submit'> Submit </button>
    </form>
    </>
  )
}