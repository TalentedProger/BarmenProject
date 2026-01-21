export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*/.test(error.message);
}

export async function handleGoogleLogin() {
  try {
    // Проверяем доступность Google OAuth endpoint
    const checkResponse = await fetch('/api/auth/google', {
      method: 'HEAD',
      credentials: 'include'
    }).catch(() => null);
    
    if (!checkResponse || !checkResponse.ok) {
      console.error('[AUTH] Google OAuth endpoint not available');
      throw new Error('Google OAuth недоступен');
    }
    
    // Перенаправляем на Google OAuth
    window.location.href = '/api/auth/google';
  } catch (error) {
    console.error('[AUTH] Google login failed:', error);
    alert('Не удалось войти через Google. Проверьте подключение.');
    return false;
  }
}

export function handleLogout() {
  return fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  }).then(res => res.json());
}