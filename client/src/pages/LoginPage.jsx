import { useApp } from '../hooks/useApp';
import { useNavigate } from 'react-router-dom';
import { useFormikForm } from '../hooks/useFormikForm';
import { loginSchema } from '../validators/productValidation';

export function LoginPage() {
  const { userInfo, login } = useApp();
  const navigate = useNavigate();

  const formik = useFormikForm({
    initialValues: { name: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const result = await login(values.name, values.password);
      if (result.success) {
        formik.resetForm();
        navigate('/');
      } else {
        alert(result.error);
      }
    }
  });

  if (userInfo) return <p>Already logged in as {userInfo.name}</p>;

  return (
    <form onSubmit={formik.handleSubmit}>


      <label htmlFor="name">Name: </label>
      <input
        type="text"
        name="name"
        id="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Enter name..."
      />
      {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}

      <label htmlFor="password">Password: </label>
      <input
        type="password"
        name="password"
        id="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Enter password..."
      />
      {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}

      <button type="submit">Login</button>
    </form>
  );
}