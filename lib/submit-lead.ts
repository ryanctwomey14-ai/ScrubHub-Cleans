export async function submitLead(data: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, page: window.location.pathname }),
    });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !json.ok) return { ok: false, error: json.error ?? "Something went wrong. Please try again." };
    return { ok: true };
  } catch {
    return { ok: false, error: "We couldn't reach the server. Please call or text us instead." };
  }
}
