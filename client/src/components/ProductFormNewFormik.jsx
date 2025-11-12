import { ProductForm } from "./ProductForm";
import { useApp } from "../hooks/useApp";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function ProductFormNewFormik() {
  const { 
    setActiveCategoryId, 
    fetchAllCategories,
    activeCategoryId, 
    tempFormName,     
    setTempFormName   
  } = useApp();
  const navigate = useNavigate();

  // --- 1. Fetch Categories on Mount ---
  // Ensures the dropdown options are loaded.
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // --- 2. Cleanup Effect ---
  // Clears the temporary name state (tempFormName) after the form has loaded it,
  // preventing it from being accidentally restored on future, unrelated navigations.
  useEffect(() => {
    if (activeCategoryId && tempFormName) {
        setTempFormName(null);
    }
  }, [activeCategoryId, tempFormName, setTempFormName]);


  return (
    <ProductForm 
      // 💡 Data passed to ProductForm for initial values:
      // These props tell the ProductForm what the starting values should be 
      // based on context state (e.g., if a new category was just made).
      activeCategoryId={activeCategoryId}
      tempFormName={tempFormName}

      // --- Submission Success Handler ---
      onSuccess={(newProduct) => {
        // 1. Clear temp name state upon final successful product submission
        setTempFormName(null); 
        
        // 2. Set the active category ID (This is the required cleanup from the creation flow)
        setActiveCategoryId(newProduct.category_id);
        
        // 3. Navigate home
        navigate('/');
      }} 
    />
  );
}