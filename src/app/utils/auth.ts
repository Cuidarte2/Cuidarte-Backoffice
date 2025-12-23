export function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem('cuidarte_usuario');
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token ?? null;
  } catch (err) {
    console.error('Error leyendo token de localStorage:', err);
    return null;
  }
}

export function clearSession() {

}
