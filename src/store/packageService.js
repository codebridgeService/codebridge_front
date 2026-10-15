import { apiFetch } from '@/lib/api';

export const packageService = {
  async getPackages(activeOnly = false) {
    const res = await apiFetch(`/packages${activeOnly ? '?active=true' : ''}`);
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to fetch packages'); }
    return res.json();
  },

  async getPackage(id) {
    const res = await apiFetch(`/packages/${id}`);
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to fetch package'); }
    return res.json();
  },

  async createPackage(packageData) {
    const isFormData = typeof FormData !== 'undefined' && packageData instanceof FormData;
    const res = await apiFetch('/packages', {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? packageData : JSON.stringify(packageData),
    });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to create package'); }
    return res.json();
  },

  async updatePackage(id, packageData) {
    const isFormData = typeof FormData !== 'undefined' && packageData instanceof FormData;
    const res = await apiFetch(`/packages/${id}`, {
      method: 'PUT',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? packageData : JSON.stringify(packageData),
    });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to update package'); }
    return res.json();
  },

  async deletePackage(id) {
    const res = await apiFetch(`/packages/${id}`, { method: 'DELETE' });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to delete package'); }
    return res.json();
  },

  async reorderPackages(orders) {
    const res = await apiFetch('/admin/packages/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders }),
    });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to reorder packages'); }
    return res.json();
  },
};
