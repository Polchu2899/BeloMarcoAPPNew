import { Client } from '../types/client';

// Encabezados exactos del CSV proporcionado
const CSV_HEADERS = [
  "Id", "Nombre", "Dirección", "Latitud", "Longitud", "Teléfono", "Teléfono2", "Teléfono3", "Teléfono4", 
  "Website", "Email", "Valoración", "Color del marcador del mapa", "Etiquetas", "Zonas", 
  "Campo personalizado 1 (NIF/CIF)", "Campo personalizado 2 (CONTACTO)", "Campo personalizado 3 (FORMA DE PAGO)", 
  "Campo personalizado 4 (NUMERO DE CUENTA)", "Campo personalizado 5 (CODIGO POSTAL)", 
  "Campo personalizado 6 (DIRECCION DE ENVIO)", "Campo personalizado 7 (IVA/RE)", 
  "Campo personalizado 8 (BOTIGUES)", "Campo personalizado 9", "Campo personalizado 10"
];

export const convertToCSV = (clients: Client[]): string => {
  const rows = clients.map(c => [
    c.id,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    c.lat || '',
    c.lng || '',
    c.phone || '',
    c.phone2 || '',
    c.phone3 || '',
    c.phone4 || '',
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
    `"${(c.custom9 || '').replace(/"/g, '""')}"`,
    `"${(c.custom10 || '').replace(/"/g, '""')}"`
  ].join(','));
  
  return [CSV_HEADERS.join(','), ...rows].join('\n');
};

export const parseCSV = (csvText: string): Client[] => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];
  
  const clients: Client[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!values) continue;
    
    const cleanValues = values.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    // Lógica inteligente para separar Email de Teléfono
    // Recogemos todos los posibles campos de contacto
    const contactFields = [
      cleanValues[5], // Teléfono 1
      cleanValues[6], // Teléfono 2
      cleanValues[7], // Teléfono 3
      cleanValues[8], // Teléfono 4
      cleanValues[10] // Email original
    ].filter(v => v && v.trim() !== '');

    // Separamos los que tienen @ (emails) de los que no (teléfonos)
    const emails = contactFields.filter(v => v.includes('@'));
    const phones = contactFields.filter(v => !v.includes('@'));

    clients.push({
      id: cleanValues[0] || Math.random().toString(36).substr(2, 9),
      name: cleanValues[1] || '',
      address: cleanValues[2] || '',
      lat: cleanValues[3],
      lng: cleanValues[4],
      // Asignamos los teléfonos encontrados en orden
      phone: phones[0] || '',
      phone2: phones[1] || '',
      phone3: phones[2] || '',
      phone4: phones[3] || '',
      website: cleanValues[9],
      // Asignamos el primer email encontrado
      email: emails[0] || '',
      rating: cleanValues[11],
      markerColor: cleanValues[12],
      tags: cleanValues[13],
      zones: cleanValues[14],
      nif: cleanValues[15],
      contact: cleanValues[16],
      paymentMethod: cleanValues[17],
      accountNumber: cleanValues[18],
      postalCode: cleanValues[19],
      shippingAddress: cleanValues[20],
      taxType: cleanValues[21],
      shops: cleanValues[22],
      custom9: cleanValues[23],
      custom10: cleanValues[24],
      activities: [],
      documents: []
    });
  }
  
  return clients;
};

export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};