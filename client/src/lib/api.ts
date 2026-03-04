const BASE_URL = "http://localhost:4000";

export async function api(
  path: string,
  options: RequestInit & { json?: any } = {},
) {
  const { json, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: json ? JSON.stringify(json) : rest.body,
    credentials: "include", // ✅ sends cookies
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    throw new Error(
      (data && (data.error || data.message)) || `HTTP ${res.status}`,
    );
  }

  return data;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
