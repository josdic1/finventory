import { createContext, useState, useEffect, useMemo } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [userCategories, setUserCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    

    const API_URL = 'http://localhost:5555'; 

    // --- Data Fetching: All Categories ---
    useEffect(() => {
      fetch(`${API_URL}/categories`)
        .then(res => res.json())
        .then(data => setAllCategories(data))
        .catch(err => console.error("Failed to load categories", err));
    }, []);


    // --- Session Check ---
    useEffect(() => {
  const checkSession = async () => {
    setLoading(true); // Ensure true at start
    try {
      const res = await fetch(`${API_URL}/check_session`, {
        credentials: 'include'
      });
      if (res.ok) {
  const data = await res.json();
  if (data.logged_in) {
    setUserInfo({ id: data.user.id, name: data.user.name });
    setUserCategories(data.user.categories || []);
  }
}else {
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
  checkSession();
}, []);

    // --- Authentication Functions ---

    const login = async (name, password) => {
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, password })
        })
        const data = await res.json()
        if (res.ok) {
          setUserInfo({
            id: data.id,
            name: data.name
          })

          setUserCategories(data.categories || []); 
          return { success: true }
        } else {
          return { success: false, error: data.error }
        }
      } catch (error) {
        console.error('Login failed:', error)
        return { success: false, error: error.message }
      }
    }

    const signup = async (name, password) => {
      try {
        const res = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, password })
        })
        const data = await res.json()
        if (res.ok) {
          setUserInfo({
            id: data.id,
            name: data.name
          })
          // **IMPROVEMENT: Set user categories on signup success**
          setUserCategories(data.categories || []); 
          return { success: true }
        } else {
          return { success: false, error: data.error }
        }
      } catch (error) {
        console.error('Signup failed:', error)
        return { success: false, error: error.message }
      }
    }

    const logout = async () => {
      try {
        await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' })
        setUserInfo(null)
        setUserCategories([]) 
        setSelectedCategoryId(null) 
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    // --- Context Value (Memoized) ---
    const value = useMemo(() => ({
      userInfo,
      loading,
      login,
      signup,
      logout,
      userCategories,
      allCategories,
      selectedCategoryId, 
      setSelectedCategoryId,
    }), [userInfo, loading, userCategories, allCategories, selectedCategoryId]);

    return (
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    )
}