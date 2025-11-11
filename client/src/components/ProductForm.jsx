import { useFormikForm } from '../hooks/useFormikForm';
import { productSchema } from '../validators';
import { useContext } from 'react';
import { AppContext } from '../context/AppProvider';

export function ProductForm({ product, onSuccess }) {
  const { createProduct, updateProduct, allCategories } = useContext(AppContext);

  const formik = useFormikForm({
    initialValues: {
      name: product?.name || '',
      category_id: product?.category_id?.toString() || ''
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      const result = product
        ? await updateProduct(product, values)
        : await createProduct(values);
      if (result.success) onSuccess?.();
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}

      <select
        name="category_id"
        value={formik.values.category_id}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      >
        <option value="">Select category</option>
        {allCategories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      {formik.touched.category_id && formik.errors.category_id && <div>{formik.errors.category_id}</div>}

      <button type="submit">Save</button>
    </form>
  );
}