import { apiFetch } from '@/lib/api';

export const securityFeatureService = {
  async getFeatures() {
    const res = await apiFetch('/security-features');
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to fetch security features');
    }
    return res.json();
  },

  async getFeature(id) {
    const res = await apiFetch(`/security-features/${id}`);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to fetch security feature');
    }
    return res.json();
  },

  async createFeature(featureData) {
    const res = await apiFetch('/security-features', {
      method: 'POST',
      body: JSON.stringify(featureData),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to create security feature');
    }
    return res.json();
  },

  async updateFeature(id, featureData) {
    const res = await apiFetch(`/security-features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(featureData),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to update security feature');
    }
    return res.json();
  },

  async deleteFeature(id) {
    const res = await apiFetch(`/security-features/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to delete security feature');
    }
    return res.json();
  },

  async reorderFeatures(items) {
    const res = await apiFetch('/security-features/reorder', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to reorder security features');
    }
    return res.json();
  },
};
