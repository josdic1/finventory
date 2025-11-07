import * as Yup from 'yup'

export const productSchema = Yup.object({
    name: Yup.string()
        .required('Product name is required')
        .min(2, 'Name must be at least 2 characters'),
    category_id: Yup.string()
        .required('Please select a category')
})

export const categorySchema = Yup.object({
    name: Yup.string()
        .required('Category name is required')
        .min(2, 'Name must be at least 2 characters')
})

export const loginSchema = Yup.object({
    name: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(4, 'Password must be at least 4 characters')
})