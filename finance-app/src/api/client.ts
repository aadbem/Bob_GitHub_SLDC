async function request(path: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: { Accept: 'application/json', ...(init?.headers ?? {}) },
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getJson<T>(path: string): Promise<T> {
  const res = await request(path);
  if (!res.ok) {
    let body: { error?: { code?: string; message?: string } } | null = null;
    try {
      body = (await res.json()) as { error?: { code?: string; message?: string } };
    } catch {
      // ignora corpo não-JSON
    }
    throw new Error(body?.error?.message || `Erro ${res.status} ao consultar ${path}`);
  }
  return res.json();
}
