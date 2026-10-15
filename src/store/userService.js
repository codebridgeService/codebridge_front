import { apiFetch } from '@/lib/api';

export const userService = {
  async getUsers() {
    const res = await apiFetch('/users', { method: 'GET' });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async deleteUser(id) {
    const res = await apiFetch(`/users/${id}`, { method: 'DELETE' });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },
};

