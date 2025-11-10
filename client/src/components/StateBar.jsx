import { useApp } from "../hooks/useApp";

export function StateBar() {
    const { loading, userInfo, userCategories, allCategories, activeCategoryId } = useApp();

const productCount = userCategories.flatMap(cat => cat.products).length;

    return (
        <div>
            <h1>State Bar</h1>
            <p>Loading: {loading ? 'true' : 'false'}</p>
            <p>Logged in: {userInfo ? userInfo.name : 'false'}</p>
            <p>Categories: {userCategories.length > 0 ? userCategories.length : 'false'}</p>
            <p>All Categories: {allCategories.length > 0 ? allCategories.length : 'false'}</p>
            <p>Selected Category ID: {activeCategoryId ? activeCategoryId : 'false'}</p>
            <p>Product Count: {productCount}</p>
        </div>
    );
}