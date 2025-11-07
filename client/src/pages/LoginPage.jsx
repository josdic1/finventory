import { useNavigate } from "react-router-dom"
import { useApp } from "../hooks/useApp"
import { useFormikForm } from "../hooks/useFormikForm"
import { loginSchema } from "../validators/productValidation"

export function LoginPage() {
    const { login } = useApp()
    const navigate = useNavigate()

    const form = useFormikForm({
        initialValues: {
            name: '',
            password: ''
        },
        validationSchema: loginSchema,
  onSubmit: async (values) => {
    console.log('Submitting login form with:', values)
    const result = await login(values)
    console.log('Login result:', result)

    if (result.success) {
        console.log('Success! Navigating to /')
        navigate('/', { replace: true })
    } else {
        console.log('Failed:', result.error)
        alert(result.error)
    }
}
    })

    const onAutofill = () => {
        form.setFieldValue('name', 'josh')
        form.setFieldValue('password', '1111')
    }

    return (
        <form onSubmit={form.handleSubmit}>
            <h2>Login Form</h2>
            <input type='button' onClick={onAutofill} value="Autofill"/>
            
            <p>
                <input 
                    type="text" 
                    name='name' 
                    placeholder="Username" 
                    value={form.values.name}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                />
                {form.touched.name && form.errors.name && (
                    <span className="error">{form.errors.name}</span>
                )}
            </p>
            
            <p>
                <input 
                    type="password" 
                    name='password' 
                    placeholder="Password"
                    value={form.values.password}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                />
                {form.touched.password && form.errors.password && (
                    <span className="error">{form.errors.password}</span>
                )}
            </p>
            
            <button type='submit'>Login</button>
            <button type='button' onClick={() => form.resetForm()}>Clear</button>
        </form>
    )
}