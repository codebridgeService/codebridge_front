import { apiFetch } from '@/lib/api';

export const projectService = {
  async getProjects() {
    const res = await apiFetch('/projects', { method: 'GET' });
    if (!res.ok) { 
      const error = await res.json().catch(() => ({})); 
      throw new Error(error.message || error.error || 'Failed to fetch projects'); 
    }
    return res.json();
  },

  async getProject(id) {
    const res = await apiFetch(`/projects/${id}`, { method: 'GET' });
    if (!res.ok) { 
      const error = await res.json().catch(() => ({})); 
      throw new Error(error.message || error.error || 'Failed to fetch project'); 
    }
    return res.json();
  },

  async createProject(formData) {
    const res = await apiFetch('/projects', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) { 
      const error = await res.json().catch(() => ({})); 
      throw new Error(error.message || error.error || 'Failed to create project'); 
    }
    return res.json();
  },

  async updateProject(id, payload) {
    const body = (typeof FormData !== 'undefined' && payload instanceof FormData)
      ? payload
      : JSON.stringify(payload);
    const res = await apiFetch(`/projects/${id}`, {
      method: 'PUT',
      body,
    });
    if (!res.ok) { 
      const error = await res.json().catch(() => ({})); 
      throw new Error(error.message || error.error || 'Failed to update project'); 
    }
    return res.json();
  },

  async deleteProject(id) {
    const res = await apiFetch(`/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) { 
      const error = await res.json().catch(() => ({})); 
      throw new Error(error.message || error.error || 'Failed to delete project'); 
    }
    return res.json();
  },

  async reorderProjects(orders) {
    const res = await apiFetch('/admin/projects/reorder', {
      method: 'POST',
      body: JSON.stringify({ orders }),
    });
    if (!res.ok) { 
      const error = await res.json().catch(() => ({})); 
      throw new Error(error.message || error.error || 'Failed to reorder projects'); 
    }
    return res.json();
  }
};

