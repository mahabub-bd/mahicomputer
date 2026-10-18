"use client";



async function handle(res: Response) {
  if (res.ok) return res.json();
  const body = await res.json().catch(() => ({}));
  const issues: string[] | undefined = body.issues;
  throw new Error(issues?.join(", ") || body.error || `Request failed (${res.status})`);
}

export function apiPost<T = unknown>(url: string, data: unknown): Promise<T> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handle);
}

export function apiPut<T = unknown>(url: string, data: unknown): Promise<T> {
  return fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handle);
}

export function apiPatch<T = unknown>(url: string, data: unknown): Promise<T> {
  return fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handle);
}

export function apiDelete<T = unknown>(url: string): Promise<T> {
  return fetch(url, { method: "DELETE" }).then(handle);
}

export function apiUpload(url: string, formData: FormData): Promise<{ url: string }> {
  return fetch(url, { method: "POST", body: formData }).then(handle);
}
