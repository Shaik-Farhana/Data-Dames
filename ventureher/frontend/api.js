// VentureHer Shared API Config
const API_BASES = [
  import.meta.env.VITE_API_URL,
  "http://localhost:8000",
  "http://localhost:8001",
].filter(Boolean);

async function apiFetch(path, options = {}) {
  let lastError;

  for (const baseURL of API_BASES) {
    try {
      const res = await fetch(baseURL + path, options);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "API error");
      }
      return res.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
