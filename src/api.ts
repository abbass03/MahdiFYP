import type { ScannedItem, InventoryGroup} from "./types";

// CRA uses process.env.REACT_APP_*
const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";



export async function listScans(): Promise<ScannedItem[]> {
  const res = await fetch(`${API}/scans`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function approveScan(id: number): Promise<ScannedItem> {
  const res = await fetch(`${API}/scans/${id}/approve`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listInventory(): Promise<ScannedItem[]> {
  const res = await fetch(`${API}/inventory`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const absImageUrl = (rel?: string | null): string | undefined => {
  if (!rel) return undefined;
  return rel.startsWith("http") ? rel : `${API}${rel}`;
};

export async function clearCompletedScans(): Promise<{ deleted: number }> {
  const res = await fetch(`${API}/scans/clear_completed`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listInventoryGrouped(): Promise<InventoryGroup[]> {
  const res = await fetch(`${API}/inventory/grouped`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}