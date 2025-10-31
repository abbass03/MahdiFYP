import { useState, useEffect } from "react";
import { Search, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { listScans, approveScan, absImageUrl, clearCompletedScans } from "../api";
import type { ScannedItem } from "../types";
import { imageForLabel } from "../productImages";

interface Props {
  darkMode: boolean;
}
type Filter = "all" | "in_progress" | "completed";

export default function ScannedProductsPage({ darkMode }: Props) {
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setErr = (err: unknown, fallback: string) => {
    if (err instanceof Error) setError(err.message);
    else setError(fallback);
  };

  const refresh = async () => {
    try {
      setError(null);
      const data = await listScans();
      setItems(data);
    } catch (err: unknown) {
      setErr(err, "Failed to load scans");
    }
  };

  useEffect(() => {
    void refresh(); // initial load
    const id = setInterval(() => {
      void refresh();
    }, 4000); // poll every 4s
    return () => clearInterval(id);
  }, []);

  const onApprove = async (id: number) => {
    setBusy(true);
    try {
      await approveScan(id);
      await refresh();
    } catch (err: unknown) {
      setErr(err, "Approve failed");
    } finally {
      setBusy(false);
    }
  };

  const onClearCompleted = async () => {
    if (
      !confirm(
        "Remove all completed scans from the scan list? Inventory items remain and images are kept."
      )
    )
      return;
    setBusy(true);
    try {
      await clearCompletedScans();
      await refresh();
    } catch (err: unknown) {
      setErr(err, "Clear completed failed");
    } finally {
      setBusy(false);
    }
  };

  const filtered = items.filter((it) => {
    const q = search.toLowerCase();
    const matchesText =
      (it.label ?? "").toLowerCase().includes(q) ||
      (it.raw_text ?? "").toLowerCase().includes(q);
    const matchesFilter = filter === "all" || it.status === filter;
    return matchesText && matchesFilter;
  });

  const badge = (status: ScannedItem["status"]) =>
    status === "in_progress"
      ? {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          label: "In progress",
        }
      : {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: "Completed",
        };

  return (
    <main className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} py-8`}>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Scanned Products
          </h1>

          <div className="flex items-center gap-3">
            <div className={`relative ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm`}>
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by OCR text"
                className={`pl-10 pr-4 py-2 w-64 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className={`p-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            >
              <option value="all">All</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={onClearCompleted}
              className="px-3 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
              disabled={busy}
            >
              Clear Completed
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-4 flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((it) => {
            const s = badge(it.status);

            // Catalog-first image with fallback to the scanned photo
            const fallback = absImageUrl(it.image_url ?? undefined);
            const imgSrc = imageForLabel(it.label, fallback);

            return (
              <div
                key={it.id}
                className={`rounded-lg shadow-md overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {imgSrc ? (
                  <div className="relative h-48">
                    <img src={imgSrc} alt={it.label ?? ""} className="w-full h-full object-cover" />
                    <div
                      className={`absolute top-2 right-2 px-2 py-1 rounded-full flex items-center gap-1 ${s.bg} ${s.text}`}
                    >
                      {s.icon}
                      <span className="text-xs font-medium">{s.label}</span>
                    </div>
                  </div>
                ) : null}

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {it.label ?? "—"}
                    </h3>
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
                      {it.confidence != null ? `${it.confidence.toFixed(1)}%` : "-"}
                    </span>
                  </div>

                  <p className={`mt-1 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {it.raw_text ?? ""}
                  </p>

                  <div className="mt-3 flex justify-between items-center text-xs">
                    <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                      {new Date(it.created_at).toLocaleString()}
                    </span>

                    {it.status === "in_progress" && (
                      <button
                        onClick={() => onApprove(it.id)}
                        className="px-3 py-1 rounded bg-emerald-600 text-white disabled:opacity-50"
                        disabled={busy}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              No scans yet. Post an image to /scans.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
