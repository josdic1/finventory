// src/components/ProductForm.jsx
import { useFormikForm } from '../hooks/useFormikForm';
import { productSchema } from '../validators/productValidation';
import { useApp } from '../hooks/useApp';
import { useNavigate } from 'react-router-dom'; // 💡 1. Import useNavigate

export function ProductForm({ 
    product, 
    onSuccess, 
    // New props for restoration/pre-selection (needed by ProductFormNewFormik)
    activeCategoryId, 
    tempFormName 
}) {
  const { createProduct, updateProduct, allCategories } = useApp();
  const navigate = useNavigate(); // 💡 2. Initialize useNavigate

  // Helper to find the current category object for display
  const currentCategory = allCategories.find(c => c.id === product?.category_id);


  // --- INITIAL VALUES LOGIC ---
  const initialValues = {
    // Determine initial name: existing product > temporary saved name > empty string
    name: product?.name || tempFormName || '', 
    rack: product?.rack || '',
    bin: product?.bin || '',
    // Determine initial category: existing product > activeCategoryId > empty string
    // NOTE: .toString() is required because Formik values must be strings for <select>
    category_id: product?.category_id?.toString() || activeCategoryId?.toString() || '',
  };


  // --- FORMIK SETUP ---
  const formik = useFormikForm({
    initialValues: initialValues,
    validationSchema: productSchema,
    onSubmit: async (values) => {
      // Parse category_id back to an integer for the API payload
      const payload = { ...values, category_id: parseInt(values.category_id) };
      
      const result = product
        ? await updateProduct(product, payload)
        : await createProduct(payload);
      
      if (result.success) {
        formik.resetForm(); // Reset Formik state on success
        onSuccess?.(result.data || payload);
      } else {
        alert("Submission failed: " + (result.error || "Unknown error"));
      }
    }
  });


  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>{product ? `Edit ${product.name}` : 'Create New Product'}</h2>

      {/* --- NAME INPUT --- */}
      <label htmlFor="name">Name:</label>
      <input name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Name" required />
      {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}

      <label htmlFor="category_id">Category:</label>
      
      {product ? (
        // --- 1. EDIT MODE (READ-ONLY) ---
        <p className="read-only-category">
          **{currentCategory?.name || 'Category not found'}**
          {/* Hidden input ensures the category_id is sent in the update payload */}
          <input type="hidden" name="category_id" value={formik.values.category_id} />
        </p>
      ) : (
        // --- 2. NEW MODE (SELECTABLE DROPDOWN) ---
        <>
          <select name="category_id" value={formik.values.category_id} onChange={formik.handleChange} onBlur={formik.handleBlur} required>
            <option value="">Select category</option>
            {allCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          {formik.touched.category_id && formik.errors.category_id && <div>{formik.errors.category_id}</div>}
        </>
      )}

      {/* 💡 3. THE MISSING BUTTON! (Only renders in NEW mode, which doesn't have a 'product' prop) */}
      {!product && (
        <p>
            Don't see your category? Add it 
            <button type='button' onClick={() => navigate('/categories/new')}> HERE</button>
        </p>
      )}


      {/* --- RACK INPUT --- */}
      <label htmlFor="rack">Rack:</label>
      <input name="rack" value={formik.values.rack} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Rack" />
      
      {/* --- BIN INPUT --- */}
      <label htmlFor="bin">Bin:</label>
      <input name="bin" value={formik.values.bin} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Bin" />

      <button type="submit">{product ? 'Update' : 'Create'}</button>
    </form>
  );
}