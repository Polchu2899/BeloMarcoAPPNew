import React, { useRef } from 'react';
import { Download, Upload, FileJson, FileSpreadsheet, AlertTriangle, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Client } from '../types/client';
import { convertToCSV, parseCSV, downloadFile } from '../utils/dataPersistence';
import { showSuccess, showError } from '@/utils/toast';

interface DataManagementProps {
  clients: Client[];
  onImport: (clients: Client[]) => void;
}

const DataManagement = ({ clients, onImport }: DataManagementProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const dbInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    const csv = convertToCSV(clients);
    downloadFile(csv, 'mis_clientes.csv', 'text/csv;charset=utf-8;');
    showSuccess('Excel (CSV) exportado correctamente');
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(clients, null, 2);
    downloadFile(json, 'backup_clientes.json', 'application/json');
    showSuccess('Copia de seguridad JSON creada');
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const importedClients = parseCSV(text);
        if (importedClients.length > 0) {
          onImport(importedClients);
          showSuccess(`${importedClients.length} clientes importados`);
        }
      } catch (err) {
        showError('Error al leer el archivo CSV');
      }
    };
    reader.readAsText(file);
  };

  const handleImportDB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);
        
        let dataToImport: Client[] = [];
        
        if (Array.isArray(json)) {
          dataToImport = json;
        } else if (json.clients && Array.isArray(json.clients)) {
          dataToImport = json.clients;
        } else if (typeof json === 'object') {
          // Si es un objeto con tablas, intentamos buscar la que parezca de clientes
          const possibleTable = Object.values(json).find(val => Array.isArray(val)) as Client[];
          if (possibleTable) dataToImport = possibleTable;
        }

        if (dataToImport.length > 0) {
          onImport(dataToImport);
          showSuccess(`${dataToImport.length} clientes importados correctamente`);
        } else {
          showError('No se encontraron datos de clientes en el archivo');
        }
      } catch (err) {
        showError('El archivo no tiene un formato JSON válido');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Database className="h-4 w-4 text-purple-600" />
          Importar Datos (JSON o .db)
        </h3>
        <Button variant="outline" onClick={() => dbInputRef.current?.click()} className="w-full gap-2">
          <Upload className="h-4 w-4" /> Seleccionar archivo de datos
        </Button>
        <input 
          type="file" 
          ref={dbInputRef} 
          onChange={handleImportDB} 
          accept=".db,.json" 
          className="hidden" 
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          Excel / Google Sheets (CSV)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" /> Exportar
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" /> Importar
          </Button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImportCSV} 
          accept=".csv" 
          className="hidden" 
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <FileJson className="h-4 w-4 text-blue-600" />
          Copia de Seguridad (JSON)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleExportJSON} className="gap-2">
            <Download className="h-4 w-4" /> Guardar
          </Button>
          <Button variant="outline" onClick={() => dbInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" /> Restaurar
          </Button>
        </div>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800">
          Al importar datos, se combinarán con los que ya tienes. Asegúrate de que el formato sea correcto.
        </p>
      </div>
    </div>
  );
};

export default DataManagement;