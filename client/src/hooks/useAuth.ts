// Simplified auth hook - no authentication required
export function useAuth() {
  return {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  };
}
