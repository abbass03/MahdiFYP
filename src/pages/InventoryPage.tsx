import React, { useEffect, useState } from "react";
import { Search, Package } from "lucide-react";
import { listInventoryGrouped, absImageUrl } from "../api";
import type { InventoryGroup } from "../types";
import { imageForLabel } from "../productImages";

interface Props {
  darkMode: boolean;
}

export default function InventoryPage({ darkMode }: Props) {
  const [items, setItems] = useState<InventoryGroup[]>([]);
  const [search, setSearch] = useState("");

  const refresh = async () => {
    const data = await listInventoryGrouped();
    setItems(data);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = items.filter((i) =>
    (i.label ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className={`text-3xl font-bold mb-4 md:mb-0 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Inventory
          </h1>
          <div className={`relative ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm`}>
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by label or text"
              className={`pl-10 pr-4 py-2 w-72 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((it, idx) => {
            // compute image URLs INSIDE the map callback
            const fallback = absImageUrl(it.latest_image_url ?? undefined);
            const imgSrc = imageForLabel(it.label, fallback);

            return (
              <div
                key={(it.label ?? "unknown") + idx}
                className={`rounded-lg shadow-md overflow-hidden ${
                  darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
                } transition-all duration-300`}
              >
                {imgSrc ? (
                  <img src={imgSrc} alt={it.label ?? ""} className="h-40 w-full object-cover" />
                ) : null}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Package className={`h-6 w-6 ${darkMode ? "text-primary-400" : "text-primary-600"}`} />
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {it.label ?? "—"}
                      </h3>
                    </div>
                    <span className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm font-semibold`}>
                      Qty: {it.count}
                    </span>
                  </div>

                  {typeof it.avg_confidence === "number" && (
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Avg OCR confidence: {it.avg_confidence.toFixed(1)}%
                    </p>
                  )}

                  {it.latest_created_at && (
                    <p className={`mt-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Latest: {new Date(it.latest_created_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>No items yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
