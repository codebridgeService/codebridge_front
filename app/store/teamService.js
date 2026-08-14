import { apiFetch } from '../lib/api';

export const teamService = {
  async getTeamMembers() {
    const res = await apiFetch('/team-members');
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async getTeamMember(id) {
    const res = await apiFetch(`/team-members/${id}`);
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async createTeamMember(formData) {
    const res = await apiFetch('/team-members', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async updateTeamMember(id, formData) {
    const res = await apiFetch(`/team-members/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async deleteTeamMember(id) {
    const res = await apiFetch(`/team-members/${id}`, { method: 'DELETE' });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },

  async reorderTeamMembers(orders) {
    const res = await apiFetch('/admin/team/reorder', {
      method: 'POST',
      body: JSON.stringify({ orders }),
    });
    if (!res.ok) { const error = await res.json(); throw new Error(error.message || JSON.stringify(error)); }
    return res.json();
  },
};

