import { apiFetch } from '../lib/api';

export const securityService = {
  /**
   * Fetch all currently blocked IPs with reasons, countdowns, and attack counts
   */
  async getBlockedIPs() {
    const res = await apiFetch('/admin/blocked-ips');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Failed to fetch blocked IPs');
    }
    return await res.json();
  },

  /**
   * Manually block an IP address
   */
  async blockIP({ ip, durationMinutes = 15, reason = 'Manual ban by administrator', isPermanent = false }) {
    const res = await apiFetch('/admin/blocked-ips', {
      method: 'POST',
      body: JSON.stringify({
        ip,
        durationMinutes,
        reason,
        isPermanent,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Failed to block IP');
    }
    return await res.json();
  },

  /**
   * Unblock an IP address
   */
  async unblockIP(ip) {
    const res = await apiFetch(`/admin/blocked-ips/${encodeURIComponent(ip)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Failed to unblock IP');
    }
    return await res.json();
  },

  /**
   * Clear all active IP blocks
   */
  async clearAllBlocks() {
    const res = await apiFetch('/admin/blocked-ips/clear-all', {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Failed to clear blocks');
    }
    return await res.json();
  },

  /**
   * Fetch attack shield and security summary stats
   */
  async getSecurityStats() {
    const res = await apiFetch('/admin/security-stats');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Failed to fetch security stats');
    }
    return await res.json();
  },
};
