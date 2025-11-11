// ProductForm.jsx
import { useFormikForm } from '../hooks/useFormikForm';
import { productSchema } from '../validators/productValidation';
import { useApp } from '../hooks/useApp';

export function ProductForm({ product, onSuccess }) {
  const { createProduct, updateProduct, allCategories } = useApp();

  const formik = useFormikForm({
    initialValues: {
      name: product?.name || '',
      category_id: product?.category_id?.toString() || '',
      rack: product?.rack || '',
      bin: product?.bin || ''
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      const payload = { ...values, category_id: parseInt(values.category_id) };
      const result = product
        ? await updateProduct(product, payload)
        : await createProduct(payload);
      if (result.success) onSuccess?.(result.data || payload);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>{product ? `Edit ${product.name}` : 'Create New Product'}</h2>

      <input name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Name" required />
      {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}

      {product ? (
        <p>Category: {allCategories.find(c => c.id === product.category_id)?.name}</p>
      ) : (
        <>
          <select name="category_id" value={formik.values.category_id} onChange={formik.handleChange} onBlur={formik.handleBlur} required>
            <option value="">Select category</option>
            {allCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          {formik.touched.category_id && formik.errors.category_id && <div>{formik.errors.category_id}</div>}
        </>
      )}

      <input name="rack" value={formik.values.rack} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Rack" />
      <input name="bin" value={formik.values.bin} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Bin" />

      <button type="submit">{product ? 'Update' : 'Create'}</button>
    </form>
  );
}