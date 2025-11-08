import { useApp } from '../hooks/useApp';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
    const { login } = useApp();
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
        const loginObject = {
            name: formData.name,
            password: formData.password
        }
        await login(loginObject.name, loginObject.password);
        setFormData({
            name: '',
            password: ''
        })
        navigate('/')
    }

    return (
        <>
            <form onSubmit={onLogin}>
                <button onClick={() => login('josh', '1111')}>Josh</button>
            <label htmlFor="name">Name: </label>
            <input type="text" name="name" id="name" onChange={onFormChange} value={formData.name} placeholder='Enter name...'/>
             <label htmlFor="password">Password: </label>
             <input type="password" name="password" id="password" onChange={onFormChange} value={formData.password} placeholder='Enter password...'/>
             <button type="submit">Login</button>
            </form>
        </>
    )
}   