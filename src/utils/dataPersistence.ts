import { Client } from '../types/client';

const CSV_HEADERS = [
  "Id", "Nombre", "Dirección", "Latitud", "Longitud", "Teléfono", "Teléfono2", "Teléfono3", "Teléfono4", 
  "Website", "Email", "Valoración", "Color del marcador del mapa", "Etiquetas", "Zonas", 
  "Campo personalizado 1 (NIF/CIF)", "Campo personalizado 2 (CONTACTO)", "Campo personalizado 3 (FORMA DE PAGO)", 
  "Campo personalizado 4 (NUMERO DE CUENTA)", "Campo personalizado 5 (CODIGO POSTAL)", 
  "Campo personalizado 6 (DIRECCION DE ENVIO)", "Campo personalizado 7 (IVA/RE)", 
  "Campo personalizado 8 (BOTIGUES)", "Campo personalizado 9", "Campo personalizado 10"
];

export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

export const convertToCSV = (clients: Client[]): string => {
  const rows = clients.map(c => [
    c.id,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    c.lat || '',
    c.lng || '',
    c.phone || '',
    c.phone2 || '',
    '', '', // Tel 3 y 4
    c.website || '',
    c.email || '',
    c.rating || '',
    c.markerColor || '',
    `"${(c.tags || '').replace(/"/g, '""')}"`,
    `"${(c.zones || '').replace(/"/g, '""')}"`,
    `"${(c.nif || '').replace(/"/g, '""')}"`,
    `"${(c.contact || '').replace(/"/g, '""')}"`,
    `"${(c.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(c.accountNumber || '').replace(/"/g, '""')}"`,
    `"${(c.postalCode || '').replace(/"/g, '""')}"`,
    `"${(c.shippingAddress || '').replace(/"/g, '""')}"`,
    `"${(c.taxType || '').replace(/"/g, '""')}"`,
    `"${(c.shops || '').replace(/"/g, '""')}"`,
    '', '' // Custom 9 y 10
  ].join(','));
  
  return [CSV_HEADERS.join(','), ...rows].join('\n');
};

// Función profesional para parsear CSV manejando comillas y comas internas
function splitCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
}

export const parseCSV = (csvText: string): Client[] => {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];
  
  const clients: Client[] = [];
  
  // Empezamos en 1 para saltar la cabecera
  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i]);
    
    // Mapeo exacto por posición (0-indexed)
    clients.push({
      id: values[0] || Math.random().toString(36).substr(2, 9),
      name: values[1] || '',
      address: values[2] || '',
      lat: values[3],
      lng: values[4],
      phone: values[5] || '',
      phone2: values[6] || '',
      website: values[9],
      email: values[10],
      rating: values[11],
      markerColor: values[12],
      tags: values[13],
      zones: values[14],
      nif: values[15],           // Campo personalizado 1
      contact: values[16],       // Campo personalizado 2
      paymentMethod: values[17], // Campo personalizado 3
      accountNumber: values[18], // Campo personalizado 4
      postalCode: values[19],    // Campo personalizado 5
      shippingAddress: values[20], // Campo personalizado 6
      taxType: values[21],       // Campo personalizado 7
      shops: values[22],         // Campo personalizado 8
      activities: [],
      documents: []
    });
  }
  
  return clients;
};