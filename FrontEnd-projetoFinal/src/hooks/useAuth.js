import { useState, useEffect, useCallback } from 'react';
import api from '../api';


export function useAuth() {
const [user, setUser] = useState(() => {
try {
return JSON.parse(localStorage.getItem('user')) || null;
} catch (e) {
return null;
}
});


useEffect(() => {
if (user) localStorage.setItem('user', JSON.stringify(user));
else localStorage.removeItem('user');
}, [user]);


const login = useCallback(async ({ email, password }) => {
try {
const res = await api.post('/auth/login', { email, password });
const { token, user: resUser } = res.data;
if (token) localStorage.setItem('token', token);
setUser(resUser);
return { ok: true, user: resUser };
} catch (err) {
console.error('Login error', err);
return { ok: false, error: err.response?.data || err.message };
}
}, []);


const register = useCallback(async ({ name, email, password }) => {
try {
const res = await api.post('/auth/register', { name, email, password });
const { token, user: resUser } = res.data;
if (token) localStorage.setItem('token', token);
setUser(resUser);
return { ok: true, user: resUser };
} catch (err) {
console.error('Register error', err);
return { ok: false, error: err.response?.data || err.message };
}
}, []);


const logout = useCallback(() => {
localStorage.removeItem('token');
localStorage.removeItem('user');
setUser(null);
}, []);


return { user, login, register, logout };
}