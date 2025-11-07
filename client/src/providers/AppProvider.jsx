import { createContext } from "react";
import { useState, useEffect, useMemo } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
const [ loading, setLoading ] = useState(true)
const [ user, setUser ] = useState(null)
const [ userInfo, setUserInfo ] = useState(null)
const [ userCategories, setCategories ] = useState([])
const [ allCategories, setAllCategories ] = useState([])

const API_URL = 'http://localhost:5555/'


    // Check session on mount
useEffect(() => {
        fetch('http://localhost:5555/check_session', {
            credentials: 'include'
        })
        .then(r => r.json())
        .then(data => {
            if (data.logged_in) {  
                setUser(data.user);
            }
            setLoading(false);
        });
    }, []);
    
    // Initialize products from user
    console.log(allCategories)
    
    // Fetch all categories once
    useEffect(() => {
        fetch('http://localhost:5555/categories')
        .then(r => r.json())
        .then(data => setAllCategories(data))
    }, [])
    
   

    // ============= USER FUNCTIONS =============
    const login = async (loginObject) => {
        const response = await fetch('http://localhost:5555/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(loginObject)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setUser(data);
            return { success: true };
        } else {
            return { success: false, error: data.error };
        }
    };

    const logout = async () => {
        const response = await fetch('http://localhost:5555/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setUser(null);
            setUserProducts([]);  // Clear products on logout
            return { success: true };
        } else {
            return { success: false, error: data.error };
        }
    }

    // ============= PRODUCT FUNCTIONS =============
    const createCategory = async (category) => {
        const response = await fetch('http://localhost:5555/categories/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(category)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setAllCategories(prev => [...prev, data])

            return { success: true, data: data }; 
        } else {
            return { success: false, error: data.error };
        }
    }
    
    const createProduct = async (product) => {
        const response = await fetch('http://localhost:5555/products/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(product)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setUserProducts(prev => [...prev, data])

            return { success: true, data: data };
        } else {
            return { success: false, error: data.error };
        }
    }
    
    const updateProduct = async (product) => {
        const response = await fetch(`http://localhost:5555/products/${product.id}/edit`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(product)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setUserProducts(prev => 
                prev.map(p => p.id === data.id ? data : p)
            )
            return { success: true, data: data };
        } else {
            return { success: false, error: data.error };
        }
    }
    
    const deleteProduct = async (id) => {
        const response = await fetch(`http://localhost:5555/products/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            setUserProducts(prev => 
                prev.filter(p => p.id !== parseInt(id))
            )
            return { success: true };
        } else {
            const data = await response.json();
            return { success: false, error: data.error };
        }
    }

const value = useMemo(() => {
    return {
        userInfo
    }
}, [userInfo]);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};


