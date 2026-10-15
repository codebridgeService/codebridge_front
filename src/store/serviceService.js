import { apiFetch } from '@/lib/api';

export const serviceService = {
  async getServices(activeOnly = false) {
    const res = await apiFetch(`/services${activeOnly ? '?active=true' : ''}`);
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to fetch services'); }
    return res.json();
  },

  async getService(id) {
    const res = await apiFetch(`/services/${id}`);
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to fetch service'); }
    return res.json();
  },

  async createService(serviceData) {
    const isFormData = typeof FormData !== 'undefined' && serviceData instanceof FormData;
    const res = await apiFetch('/services', {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? serviceData : JSON.stringify(serviceData),
    });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to create service'); }
    return res.json();
  },

  async updateService(id, serviceData) {
    const isFormData = typeof FormData !== 'undefined' && serviceData instanceof FormData;
    const res = await apiFetch(`/services/${id}`, {
      method: 'PUT',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? serviceData : JSON.stringify(serviceData),
    });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to update service'); }
    return res.json();
  },

  async deleteService(id) {
    const res = await apiFetch(`/services/${id}`, { method: 'DELETE' });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to delete service'); }
    return res.json();
  },

  async importServices(services) {
    const res = await apiFetch('/services/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(services),
    });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to import services'); }
    return res.json();
  },

  async reorderServices(orders) {
    const res = await apiFetch('/admin/services/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders }),
    });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || 'Failed to reorder services'); }
    return res.json();
  }
};
