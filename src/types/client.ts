export interface Activity {
  id: string;
  date: string;
  type: 'visita' | 'llamada' | 'venta' | 'nota';
  description: string;
}

export interface Document {
  id: string;
  name: string;
  url: string; // En esta versión usaremos base64 o placeholders
  date: string;
}

export interface Client {
  id: string;
  name: string;
  owner: string;
  address: string;
  department: string;
  zone: string;
  category: string;
  phone: string;
  notes?: string;
  activities: Activity[];
  documents: Document[];
}