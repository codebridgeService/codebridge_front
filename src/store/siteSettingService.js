import { apiFetch } from '@/lib/api';

export const siteSettingService = {
  async getSettings() {
    const res = await apiFetch(`/site-settings?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to fetch site settings');
    }
    return res.json();
  },

  async updateSettings(settingsData) {
    const res = await apiFetch('/site-settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to update site settings');
    }
    return res.json();
  },
};
