import { createContext } from "react";
import { useState, useEffect, useMemo } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [userCategories, setUserCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    // --- ADD THESE STATE VARIABLES ---
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const API_URL = 'http://localhost:5555/';
    // Check session on mount
    useEffect(() => {
        fetch(`${API_URL}/check_session`, {
            credentials: 'include'
        })
        .then(r => r.json())
        .then(data => {
            if (data.logged_in && data.user) {
                // Create a temporary object for userInfo, excluding categories
                const { categories, ...restOfUserInfo } = data.user;

                // Set user info (excluding categories)
                setUserInfo(restOfUserInfo);

                // Set user-specific categories
                if (categories) {
                    setUserCategories(categories);
                } else {
                    setUserCategories([]); // Ensure it's an empty array if no categories
                }

            } else {
                setUserInfo(null);
                setUserCategories([]);
            }
            setLoading(false);
        })
        .catch(error => {
            console.error("Error checking session:", error);
            setLoading(false);
            setUserInfo(null);
            setUserCategories([]);
        });
    }, []);

    // Fetch all categories once
    useEffect(() => {
        fetch(`${API_URL}/categories/`) // Optimized with trailing slash
        .then(r => r.json())
        .then(data => setAllCategories(data))
        .catch(error => {
            console.error("Error fetching all categories:", error);
            setAllCategories([]);
        });
    }, []);
   

    // ============= USER FUNCTIONS =============
    // Example of a login function (adjusted for updated state management)
    const login = async (loginObject) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(loginObject)
        });
        const data = await response.json();
        if (response.ok) {
            if (data.user) {
                const { categories, ...restOfUserInfo } = data.user;
                setUserInfo(restOfUserInfo);
                setUserCategories(categories || []);
                setSelectedCategoryId(null); // Clear selected category on login
            }
            return { success: true };
        } else {
            return { success: false, error: data.error };
        }
    };

    // Example of a logout function (adjusted for updated state management)
    const logout = async () => {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
            setUserInfo(null);
            setUserCategories([]);
            setSelectedCategoryId(null); // Clear selected category on logout
            return { success: true };
        } else {
            return { success: false, error: data.error };
        }
    };

    // Corrected createProduct (from previous conversation)
    const createProduct = async (product) => {
        const response = await fetch(`${API_URL}/products/new`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(product)
        });
        const data = await response.json();
        if (response.ok) {
            setUserCategories(prevCategories =>
                prevCategories.map(category => {
                    if (category.id === data.category_id) {
                        return {
                            ...category,
                            products: [...(category.products || []), data]
                        };
                    }
                    return category;
                })
            );
            return { success: true, data: data };
        } else {
            return { success: false, error: data.error };
        }
    };



const updateProduct = async (productToUpdate, oldCategoryId) => {
    const response = await fetch(`${API_URL}/products/${productToUpdate.id}/edit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(productToUpdate)
    });

    const data = await response.json(); // 'data' is the updated product returned by the server

    if (response.ok) {
        setUserCategories(prevCategories => {
            return prevCategories.map(category => {
                // Find the specific category this product belongs to using the oldCategoryId
                if (category.id === oldCategoryId) {
                    return {
                        ...category, // Keep category details
                        products: (category.products || []).map(p => // Map through its products
                            p.id === data.id ? data : p // Replace the old product with the new 'data'
                        )
                    };
                }
                return category; // Return all other categories unchanged
            });
        });
        return { success: true, data: data };
    } else {
        return { success: false, error: data.error };
    }
};

    // deleteProduct (you'll need to update this similarly to create/update)
    const deleteProduct = async (id) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            setUserCategories(prevCategories =>
                prevCategories.map(category => ({
                    ...category,
                    products: (category.products || []).filter(product => product.id !== parseInt(id))
                }))
            );
            return { success: true };
        } else {
            const data = await response.json();
            return { success: false, error: data.error };
        }
    }


    const value = useMemo(() => {
        return {
            loading,
            userInfo,
            userCategories,
            allCategories,
            login,
            logout,
            createProduct,
            updateProduct,
            deleteProduct,

            selectedCategoryId,
            setSelectedCategoryId
        };
    }, [loading, userInfo, userCategories, allCategories, selectedCategoryId]); // Add selectedCategoryId to dependencies

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};