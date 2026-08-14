import { apiFetch } from '../lib/api';

export const serviceService = {
  async getServices() {
    const res = await apiFetch('/services');
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async getService(id) {
    const res = await apiFetch(`/services/${id}`);
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async createService(serviceData) {
    const res = await apiFetch('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async updateService(id, serviceData) {
    const res = await apiFetch(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async deleteService(id) {
    const res = await apiFetch(`/services/${id}`, { method: 'DELETE' });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async importServices(services) {
    const res = await apiFetch('/services/import', {
      method: 'POST',
      body: JSON.stringify(services),
    });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async reorderServices(orders) {
    const res = await apiFetch('/admin/services/reorder', {
      method: 'POST',
      body: JSON.stringify({ orders }),
    });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || 'Failed to reorder services'); }
    return res.json();
  }
};

