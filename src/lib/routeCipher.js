/**
 * URL Route Cipher for Public Link Encryption
 * Obfuscates public paths (/portfolio, /services, etc.) into URL-safe encrypted tokens.
 */

const SECRET = process.env.NEXT_PUBLIC_URL_SECRET || 'codebridge_url_secret_key_2026_secured';

function toBase64Url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) {
    b64 += '=';
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encryptRoute(path) {
  if (!path || path === '/' || path.startsWith('/admin') || path.startsWith('/_next') || path.startsWith('/api')) {
    return path;
  }
  const clean = path.startsWith('/') ? path : '/' + path;
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) & 0xff;
  }
  const salt = hash;
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(clean);
  const out = [salt];
  for (let i = 0; i < textBytes.length; i++) {
    const keyByte = (SECRET.charCodeAt((i + salt) % SECRET.length) * 37 + salt * 13) & 0xff;
    out.push(textBytes[i] ^ keyByte);
  }
  return 'e_' + toBase64Url(out);
}

export function decryptRoute(token) {
  try {
    if (!token || !token.startsWith('e_')) return null;
    const b64 = token.slice(2);
    const bytes = fromBase64Url(b64);
    if (bytes.length < 2) return null;
    const salt = bytes[0];
    const decrypted = [];
    for (let i = 1; i < bytes.length; i++) {
      const keyByte = (SECRET.charCodeAt((i - 1 + salt) % SECRET.length) * 37 + salt * 13) & 0xff;
      decrypted.push(bytes[i] ^ keyByte);
    }
    const decoder = new TextDecoder();
    const path = decoder.decode(new Uint8Array(decrypted));
    if (path.startsWith('/')) return path;
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the public encrypted URL for a given route.
 * E.g., getEncryptedHref('/portfolio') => '/e/e_-U9sUVAUufqzGg8'
 * E.g., getEncryptedHref('/services#web-development') => '/e/e_jTYQkpa-qxt30A#web-development'
 */
export function getEncryptedHref(path) {
  if (!path || path === '/' || path.startsWith('/admin') || path.startsWith('#') || path.startsWith('http')) {
    return path;
  }
  
  // Separate hash and query if present
  let cleanPath = path;
  let suffix = '';
  
  const hashIdx = cleanPath.indexOf('#');
  if (hashIdx !== -1) {
    suffix = cleanPath.slice(hashIdx);
    cleanPath = cleanPath.slice(0, hashIdx);
  }
  
  const queryIdx = cleanPath.indexOf('?');
  if (queryIdx !== -1) {
    suffix = cleanPath.slice(queryIdx) + suffix;
    cleanPath = cleanPath.slice(0, queryIdx);
  }

  const token = encryptRoute(cleanPath);
  return token.startsWith('e_') ? `/e/${token}${suffix}` : path;
}
