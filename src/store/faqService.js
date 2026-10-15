import { apiFetch } from '@/lib/api';

export const faqService = {
  async getFaqs() {
    const res = await apiFetch('/faqs');
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to fetch FAQs');
    }
    return res.json();
  },

  async getFaq(id) {
    const res = await apiFetch(`/faqs/${id}`);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to fetch FAQ');
    }
    return res.json();
  },

  async createFaq(faqData) {
    const res = await apiFetch('/faqs', {
      method: 'POST',
      body: JSON.stringify(faqData),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to create FAQ');
    }
    return res.json();
  },

  async updateFaq(id, faqData) {
    const res = await apiFetch(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faqData),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to update FAQ');
    }
    return res.json();
  },

  async deleteFaq(id) {
    const res = await apiFetch(`/faqs/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to delete FAQ');
    }
    return res.json();
  },

  async reorderFaqs(items) {
    const res = await apiFetch('/faqs/reorder', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to reorder FAQs');
    }
    return res.json();
  },
};
