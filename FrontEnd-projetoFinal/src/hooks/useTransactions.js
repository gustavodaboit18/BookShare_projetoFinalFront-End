import { useCallback } from 'react';
import api from '../api';


export function useTransactions() {
const createTransaction = useCallback(async (payload) => {
try {
const res = await api.post('/transactions', payload);
return { ok: true, tx: res.data };
} catch (err) {
console.error('createTransaction', err);
return { ok: false, error: err.response?.data || err.message };
}
}, []);


const getUserTransactions = useCallback(async (userId) => {
try {
const res = await api.get(`/transactions/${userId}`);
return { ok: true, transactions: res.data };
} catch (err) {
console.error('getUserTransactions', err);
return { ok: false, error: err.response?.data || err.message };
}
}, []);


return { createTransaction, getUserTransactions };
}