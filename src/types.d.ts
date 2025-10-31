// Custom types for the application
interface ScannedProduct {
  id: string;
  name: string;
  timestamp: string;
  robotId: string;
  status: 'in-progress' | 'completed' | 'failed';
  location: string;
}

interface ScannedProductsPageProps {
  darkMode: boolean;
}

export type ScanStatus = "in_progress" | "completed";

export interface ScannedItem {
  id: number;
  label?: string | null;        
  confidence?: number | null;   
  raw_text?: string | null;     
  image_url: string;            
  status: ScanStatus;           
  created_at: string;         
}

export interface InventoryGroup {
  label: string | null;
  count: number;
  latest_image_url?: string | null;
  latest_created_at?: string | null;
  avg_confidence?: number | null;
}
