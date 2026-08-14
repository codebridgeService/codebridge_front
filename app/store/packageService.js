import { apiFetch } from '../lib/api';

export const packageService = {
  async getPackages() {
    const res = await apiFetch('/packages');
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async getPackage(id) {
    const res = await apiFetch(`/packages/${id}`);
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async createPackage(packageData) {
    const res = await apiFetch('/packages', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async updatePackage(id, packageData) {
    const res = await apiFetch(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(packageData),
    });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async deletePackage(id) {
    const res = await apiFetch(`/packages/${id}`, { method: 'DELETE' });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async reorderPackages(orders) {
    const res = await apiFetch('/admin/packages/reorder', {
      method: 'POST',
      body: JSON.stringify({ orders }),
    });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },
};

