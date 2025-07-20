export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*/.test(error.message);
}

export function handleGoogleLogin() {
  window.location.href = '/api/auth/google';
}

export function handleGuestLogin() {
  return fetch('/api/auth/guest', {
    method: 'POST',
    credentials: 'include',
  }).then(res => res.json());
}

export function handleLogout() {
  return fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  }).then(res => res.json());
}