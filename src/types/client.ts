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
  website?: string;
  email?: string;
  rating?: string;
  markerColor?: string;
  tags?: string;
  zones?: string;
  
  // Campos de negocio reales (Mapeados desde campos personalizados del CSV)
  nif?: string;           // Campo 1: NIF/CIF/DNI
  contact?: string;       // Campo 2: Persona de Contacto
  paymentMethod?: string; // Campo 3: Forma de Pago
  accountNumber?: string; // Campo 4: IBAN / Nº Cuenta
  postalCode?: string;    // Campo 5: Código Postal
  shippingAddress?: string; // Campo 6: Dirección Envío
  taxType?: string;       // Campo 7: IVA / RE
  shops?: string;         // Campo 8: Botigues
  custom9?: string;
  custom10?: string;
  
  notes?: string;
  activities: Activity[];
  documents: Document[];
}