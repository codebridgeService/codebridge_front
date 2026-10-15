import { apiFetch } from '@/lib/api';

export const workStepService = {
  async getSteps() {
    const res = await apiFetch('/work-steps');
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to fetch work steps');
    }
    return res.json();
  },

  async getStep(id) {
    const res = await apiFetch(`/work-steps/${id}`);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to fetch work step');
    }
    return res.json();
  },

  async createStep(stepData) {
    const res = await apiFetch('/work-steps', {
      method: 'POST',
      body: JSON.stringify(stepData),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to create work step');
    }
    return res.json();
  },

  async updateStep(id, stepData) {
    const res = await apiFetch(`/work-steps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stepData),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to update work step');
    }
    return res.json();
  },

  async deleteStep(id) {
    const res = await apiFetch(`/work-steps/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to delete work step');
    }
    return res.json();
  },

  async reorderSteps(items) {
    const res = await apiFetch('/work-steps/reorder', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to reorder work steps');
    }
    return res.json();
  },
};
