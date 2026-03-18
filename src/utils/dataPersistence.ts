import { Client } from '../types/client';

// Convertir lista de clientes a formato CSV (compatible con Excel)
export const convertToCSV = (clients: Client[]): string => {
  const headers = ['id', 'name', 'owner', 'address', 'department', 'zone', 'phone', 'notes'];
  const rows = clients.map(c => [
    c.id,
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.owner.replace(/"/g, '""')}"`,
    `"${c.address.replace(/"/g, '""')}"`,
    `"${c.department.replace(/"/g, '""')}"`,
    `"${c.zone.replace(/"/g, '""')}"`,
    c.phone,
    `"${(c.notes || '').replace(/"/g, '""')}"`
  ].join(','));
  
  return [headers.join(','), ...rows].join('\n');
};

// Procesar un archivo CSV y convertirlo a objetos de cliente
export const parseCSV = (csvText: string): Client[] => {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const clients: Client[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Regex simple para manejar comas dentro de comillas
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!values) continue;
    
    const cleanValues = values.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    clients.push({
      id: cleanValues[0] || Math.random().toString(36).substr(2, 9),
      name: cleanValues[1] || '',
      owner: cleanValues[2] || '',
      address: cleanValues[3] || '',
      department: cleanValues[4] || '',
      zone: cleanValues[5] || '',
      phone: cleanValues[6] || '',
      notes: cleanValues[7] || ''
    });
  }
  
  return clients;
};

// Función para descargar archivos
export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};