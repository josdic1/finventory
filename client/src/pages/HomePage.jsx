// In HomePage.jsx
import { UserCategories } from "../components/UserCategories";
import { useApp } from "../hooks/useApp";

export function HomePage() {

    const { userCategories } = useApp(); 

    return (
        <div>
        
         <UserCategories categoriesToDisplay={userCategories}/> 
        </div>
    );
}
