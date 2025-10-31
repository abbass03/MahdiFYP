// src/productImages.ts

// Map canonical labels (lowercase) to your catalog images
export const PRODUCT_IMAGES: Record<string, string> = {
  laptop: "/product-images/laptop.jpg",
  mouse: "/product-images/mouse.jpg",
 
};

// Optional: aliases → canonical label
// If OCR returns "l", "laptop", "lap top", etc., normalize it here.
// If OCR returns variations, normalize them here.
const ALIASES: Record<string, string> = {
  // laptops
  l: "laptop",
  "lap top": "laptop",
  notebook: "laptop",
  notebooks: "laptop",

  // mice
  m: "mouse",        // <— this is the missing one
  mice: "mouse",
  "mou se": "mouse",

  // keyboards (examples—add more if you want)
  k: "keyboard",
  kb: "keyboard",
};


function normalize(label?: string | null): string | null {
  if (!label) return null;
  const k = label.trim().toLowerCase();
  return ALIASES[k] ?? k;
}

/**
 * Returns a catalog image for the label, or the fallback (scanned image URL)
 */
export function imageForLabel(label?: string | null, fallback?: string | null): string | undefined {
  const norm = normalize(label);
  if (norm && PRODUCT_IMAGES[norm]) return PRODUCT_IMAGES[norm];
  return fallback || undefined;
}
