



import { ProductForm } from "./ProductForm";
import { useApp } from "../hooks/useApp";
import { useNavigate } from "react-router-dom";

export function ProductFormNewCopy() {
  const { setActiveCategoryId } = useApp();
  const navigate = useNavigate();

  return (
    <ProductForm 
      onSuccess={(newProduct) => {
        setActiveCategoryId(newProduct.category_id);
        navigate('/');
      }} 
    />
  );
}