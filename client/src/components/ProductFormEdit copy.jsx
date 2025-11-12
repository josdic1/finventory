




import { ProductForm } from './ProductForm';
import { useApp } from "../hooks/useApp";
import { useNavigate, useParams } from "react-router-dom"; // ← add useParams
import { useEffect, useState } from "react";

export function ProductFormEditCopy() {
  const { userCategories, setActiveCategoryId } = useApp();
  const [product, setProduct] = useState(null);
  const { id } = useParams(); // ← now defined
  const navigate = useNavigate();

  useEffect(() => {
    const found = userCategories.flatMap(c => c.products).find(p => p.id === parseInt(id));
    setProduct(found || null);
  }, [id, userCategories]);

  if (!product) return <div>Loading...</div>;

  return (
    <ProductForm 
      product={product} 
      onSuccess={() => {
        setActiveCategoryId(product.category_id);
        navigate('/');
      }} 
    />
  );
}