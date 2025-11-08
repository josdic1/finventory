import { useApp } from '../hooks/useApp';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
    const { userInfo,login } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    })
    const navigate = useNavigate();

    function onFormChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }   

    async function onLogin(e) {
    e.preventDefault();
    if (userInfo) return; 

    const result = await login(formData.name, formData.password);
    if (result.success) {
        setFormData({ name: '', password: '' });
        navigate('/');
    } else {
        alert(result.error);
    }
}

    return (
        <>
            <form onSubmit={onLogin}>
                <button onClick={() => setFormData({ name: 'josh', password: '1111' })}>Josh</button>
            <label htmlFor="name">Name: </label>
            <input type="text" name="name" id="name" onChange={onFormChange} value={formData.name} placeholder='Enter name...'/>
             <label htmlFor="password">Password: </label>
             <input type="password" name="password" id="password" onChange={onFormChange} value={formData.password} placeholder='Enter password...'/>
             <button type="submit">Login</button>
            </form>
        </>
    )
}   