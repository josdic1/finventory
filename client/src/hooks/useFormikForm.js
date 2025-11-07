import { useFormik } from 'formik'

export function useFormikForm({ 
    initialValues, 
    validationSchema, 
    onSubmit 
}) {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
    })
    
    return {
        values: formik.values,
        errors: formik.errors,
        touched: formik.touched,
        handleChange: formik.handleChange,
        handleBlur: formik.handleBlur,
        handleSubmit: formik.handleSubmit,
        setFieldValue: formik.setFieldValue,
        resetForm: formik.resetForm
    }
}