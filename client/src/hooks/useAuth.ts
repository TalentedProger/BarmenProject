import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/user", { credentials: "include" });
        if (res.status === 401) {
          return null; // Not authenticated - это нормально
        }
        if (!res.ok) {
          return null; // Любая другая ошибка - тоже не блокируем
        }
        return await res.json();
      } catch (e) {
        // Сетевая ошибка - не блокируем загрузку страницы
        console.warn("Auth check failed:", e);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Не блокируем рендеринг при ошибке
    throwOnError: false,
  });

  const isAuthenticated = !!user && !error;

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
  };
}