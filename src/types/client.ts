export interface Activity {
  id: string;
  date: string;
  type: 'visita' | 'llamada' | 'venta' | 'nota';
  description: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  lat?: string;
  lng?: string;
  phone: string;
  phone2?: string;
  phone3?: string;
  phone4?: string;
  website?: string;
  email?: string;
  rating?: string;
  markerColor?: string;
  tags?: string;
  zones?: string;
  // Campos personalizados mapeados
  nif?: string;           // Campo 1
  contact?: string;       // Campo 2
  paymentMethod?: string; // Campo 3
  accountNumber?: string; // Campo 4
  postalCode?: string;    // Campo 5
  shippingAddress?: string; // Campo 6
  taxType?: string;       // Campo 7 (IVA/RE)
  shops?: string;         // Campo 8 (BOTIGUES)
  custom9?: string;
  custom10?: string;
  
  notes?: string;
  activities: Activity[];
  documents: Document[];
}