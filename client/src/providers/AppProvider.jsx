import { createContext, useState, useEffect, useMemo } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [userCategories, setUserCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [activeCategoryId, setActiveCategoryId] = useState(null); 
    const [showStateBar, setShowStateBar] = useState(false);
    const [ tempFormName, setTempFormName ] = useState('');

    const API_URL = 'http://localhost:5555'; 

    useEffect(() => {
        checkSession();
    }, []);


    const checkSession = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/check_session`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data.logged_in) {
                    setUserInfo({ id: data.user.id, name: data.user.name });
                    setUserCategories(data.user.categories || []);
                }
            } else {
                setUserInfo(null);
                setUserCategories([]);
            }
        } catch (error) {
            console.error('Session check failed:', error);
            setUserInfo(null);
            setUserCategories([]);
        } finally {
            setLoading(false);
        }
    };



    // --- Authentication Functions ---
    const login = async (name, password) => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, password })
            });
            const data = await res.json();
            if (res.ok) {
                setUserInfo({ id: data.id, name: data.name });
                setUserCategories(data.categories || []);
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
            setUserInfo(null);
            setUserCategories([]);
            setAllCategories([]);
            setActiveCategoryId(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // --- Category Functions ---

    const fetchAllCategories = async() => {
        if (userInfo) {
            fetch(`${API_URL}/categories`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to load categories");
                    return res.json();
                })
                .then(data => setAllCategories(data))
                .catch(err => {
                    console.error("Failed to load categories", err);
                    setAllCategories([]);
                });
        } else {
            setAllCategories([]);
        }
    }

    async function createCategory(newCategory) {
        try {
            const response = await fetch(`${API_URL}/categories/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newCategory)
            });
            
            const data = await response.json();
            if (response.ok) {
                setUserCategories(prev => [...prev, data]);
                setAllCategories(prev => [...prev, data]);
                return data
            }
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    }

    // --- Product Functions ---
    async function createProduct(newProduct) {
        try {
            const response = await fetch(`${API_URL}/products/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newProduct)
            });
            const data = await response.json();
            if (response.ok) {
                setUserCategories(prev => {
                    const categoryExists = prev.some(cat => cat.id === data.category_id);
                    if (categoryExists) {
                        return prev.map(cat =>
                            cat.id === data.category_id
                                ? { ...cat, products: [...(cat.products || []), data] }
                                : cat
                        );
                    } else {
                        const newCategory = allCategories.find(c => c.id === data.category_id);
                        if (newCategory) {
                            return [...prev, { id: newCategory.id, name: newCategory.name, products: [data] }];
                        }
                        return prev;
                    }
                });
                return { success: true, data };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function updateProduct(originalProduct, updatedProduct) {
        try {
            const r = await fetch(`${API_URL}/products/${originalProduct.id}/edit`, { 
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedProduct)
            });
            if (!r.ok) {
                const errorData = await r.json();
                return { success: false, error: errorData.error || 'Update failed' };
            }
            const data = await r.json();
            setUserCategories(prev => prev.map(cat => ({
                ...cat,
                products: cat.products.map(p => p.id === data.id ? data : p)
            })));
            return { success: true, data };
        } catch (error) {
            console.error("Caught error:", error);
            return { success: false, error: error.message };
        }
    }

    async function deleteProduct(productId) {
        try {
            const response = await fetch(`${API_URL}/products/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setUserCategories(prev => 
                    prev.map(cat => ({
                        ...cat,
                        products: cat.products.filter(p => p.id !== parseInt(productId))
                    })).filter(cat => cat.products.length > 0)
                );
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

  const value = useMemo(() => ({
    userInfo,
    loading,
    login, // Stable (declared with const/async function)
    logout, // Stable
    userCategories,
    allCategories, 
    fetchAllCategories, // 💡 Function: Should be stable (useCallback) or defined outside.
    activeCategoryId, 
    setActiveCategoryId, // Stable
    createCategory, // Stable
    createProduct, // Stable
    updateProduct, // Stable
    deleteProduct, // Stable
    showStateBar, 
    setShowStateBar, // Stable
    tempFormName, 
    setTempFormName // Stable
}), 
[
    // List only the state values (data) that, when changed, 
    // require the context value object to be recalculated.
    userInfo, 
    loading, 
    userCategories, 
    allCategories, 
    activeCategoryId, 
    showStateBar, 
    tempFormName 

]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};