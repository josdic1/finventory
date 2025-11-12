// src/components/ProductFormEditFormik.jsx (UPDATED)
import { ProductForm } from './ProductForm';
import { useApp } from "../hooks/useApp";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function ProductFormEditFormik() {
  const { userCategories, fetchAllCategories } = useApp();
  const [product, setProduct] = useState(null); // Local state to hold the found product
  const { id } = useParams(); 
  const navigate = useNavigate();

  // --- 1. Fetch Categories ---
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // --- 2. Find and Set Product ---
  // This logic is ported directly from your old useEffect
  useEffect(() => {
    if (userCategories.length > 0 && id) {
        // Find the product (using parseInt(id) is critical)
        const allProducts = userCategories.flatMap(cat => cat.products || []).filter(Boolean);
        const selectedProduct = allProducts.find(product => product.id === parseInt(id));
        
        // Update local state, which triggers the render of <ProductForm />
        setProduct(selectedProduct || null);
    }
  }, [id, userCategories]); // Re-run when ID or Category List changes

  // Display loading until the product is found
  if (!product) return <div>Loading product details...</div>;

  return (
    <ProductForm 
      product={product} 
      onSuccess={() => {
        navigate('/');
      }} 
    />
  );
}