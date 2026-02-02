export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*/.test(error.message);
}

export function handleGoogleLogin() {
  // Сразу редирект на Google OAuth - браузер сам обработает
  window.location.href = '/api/auth/google';
}

export function handleLogout() {
  return fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  }).then(res => res.json());
}