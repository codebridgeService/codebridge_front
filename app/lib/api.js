const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.map((cb) => cb(newToken));
  refreshSubscribers = [];
}

export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Accept': 'application/json',
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response = await fetch(url, config);

  // If 401 Unauthorized, attempt token refresh (except for login/refresh/register requests)
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/register')) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const storedRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(storedRefreshToken ? { 'x-refresh-token': storedRefreshToken } : {}),
          },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
          credentials: 'include',
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken);
            }
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user));
            }
            isRefreshing = false;
            onRefreshed(data.token);

            // Retry original request with new token
            headers['Authorization'] = `Bearer ${data.token}`;
            return await fetch(url, { ...config, headers });
          }
        }
      } catch (err) {
        console.error('Failed to auto-refresh token:', err);
      }

      // Refresh failed or revoked: log out user
      isRefreshing = false;
      refreshSubscribers = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=1';
        }
      }
    } else {
      // Wait for ongoing token refresh to complete then retry
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(async (newToken) => {
          try {
            headers['Authorization'] = `Bearer ${newToken}`;
            const res = await fetch(url, { ...config, headers });
            resolve(res);
          } catch (err) {
            reject(err);
          }
        });
      });
    }
  }

  return response;
}
