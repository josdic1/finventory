import { useApp } from "../hooks/useApp";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useFormikForm } from "../hooks/useFormikForm"; // 💡 Import Formik hook
import { categorySchema } from "../validators/productValidation"; // 💡 Import validation

export function NewCategoryForm() {
    const { allCategories, fetchAllCategories, createCategory, setActiveCategoryId } = useApp();
    const navigate = useNavigate();

    // --- 1. Formik Setup ---
    const formik = useFormikForm({
        initialValues: { name: '' },
        validationSchema: categorySchema, // Uses the Yup schema for basic validation
        onSubmit: async (values, { resetForm }) => {
            // --- Custom Duplication Check (Runs after Yup validation) ---
            
            let isDuplicate = false;
            if (allCategories.length > 0) {
                const duplicate = allCategories.find(c => 
                    c.name.toLowerCase() === values.name.toLowerCase()
                );
                if (duplicate?.name) {
                    alert('That category exists, please try again');
                    isDuplicate = true;
                }
            }

            if (!isDuplicate) {
                const newCategoryObject = await createCategory(values); // API call
                
                if (newCategoryObject && newCategoryObject.id) {
                    // Set active ID and navigate after success
                    setActiveCategoryId(parseInt(newCategoryObject.id));
                    resetForm(); // Clear the form
                    navigate('/products/new');
                } else {
                    alert('Failed to create category.');
                }
            }
        }
    });

    // --- 2. Fetch Categories on Mount ---
    useEffect(() => {
        fetchAllCategories();
    }, [fetchAllCategories]);


    // --- 3. Rendering ---
    return (
        <form onSubmit={formik.handleSubmit}> {/* 💡 Use Formik's handleSubmit */}
            <h2>Add New Category</h2>
            
            <label htmlFor="name">Name: </label>
            <input 
                type='text' 
                name='name' // 💡 Formik needs the 'name' attribute
                placeholder='New category'
                // 💡 Bind Formik handlers
                value={formik.values.name} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            
            {/* 💡 Display Formik validation error message */}
            {formik.touched.name && formik.errors.name && 
                <div style={{color: 'red'}}>{formik.errors.name}</div>
            }

            <button type='submit' disabled={formik.isSubmitting}> Add </button>
            
            {/* Shows status when loading categories */}
            {allCategories.length === 0 && <p style={{marginTop: '10px'}}>Fetching categories for duplicate check...</p>}
        </form>
    );
}