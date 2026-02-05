const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined in environment variables"
  );
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${API_URL}/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // ✅ Read body ONCE
  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // non-JSON response
  }

  // 🔐 AUTH ERROR (NO AUTO LOGOUT)
  if (res.status === 401) {
    throw new Error(
      data?.message || "Unauthorized"
    );
  }

  // ❌ OTHER ERRORS
  if (!res.ok) {
    throw new Error(
      data?.message || `Request failed (${res.status})`
    );
  }

  // ✅ SUCCESS
  return data as T;
}
