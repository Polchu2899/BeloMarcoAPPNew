"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Map, Filter, Database, ChevronRight, Camera, FileText, Share2, Copy, Check, Monitor, Smartphone, AlertCircle, X, Trash2, Download, Apple, Info } from 'lucide-react';
import { Client, Activity } from '../types/client';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';
import DataManagement from '../components/DataManagement';
import ActivityLog from '../components/ActivityLog';
import BottomNav from '../components/BottomNav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess, showError } from '@/utils/toast';

const Index = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('clients');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [displayLimit, setDisplayLimit] = useState(20);

  const hydrateClients = (data: any[]): Client[] => {
    return data.map(c => ({
      ...c,
      id: c.id || Math.random().toString(36).substr(2, 9),
      activities: Array.isArray(c.activities) ? c.activities : [],
      documents: Array.isArray(c.documents) ? c.documents : [],
      category: c.category || 'General',
      zone: c.zone || c.ciudad || c.Zone || 'Sin Zona', 
      department: c.department || c.Department || 'Sin Depto',
      name: c.name || c.Name || 'Sin Nombre',
      address: c.address || c.Address || 'Sin Dirección',
      owner: c.owner || c.Owner || 'Sin Propietario',
      phone: String(c.phone || c.Phone || '')
    }));
  };

  useEffect(() => {
    const savedClients = localStorage.getItem('belamarcoapp_db_v1');
    if (savedClients) {
      try {
        const parsed = JSON.parse(savedClients);
        if (Array.isArray(parsed)) {
          setClients(hydrateClients(parsed));
        }
      } catch (e) {
        console.error("Error cargando base de datos", e);
      }
    }
  }, []);

  const saveToDatabase = (newClients: Client[]) => {
    try {
      const hydrated = hydrateClients(newClients);
      setClients(hydrated);
      localStorage.setItem('belamarcoapp_db_v1', JSON.stringify(hydrated));
    } catch (e) {
      showError("Error al guardar. ¿El archivo es muy grande?");
    }
  };

  const handleImport = (importedData: Client[]) => {
    saveToDatabase(importedData);
    showSuccess(`${importedData.length} clientes memorizados`);
    setActiveTab('clients');
  };

  const handleClearData = () => {
    if (confirm("¿Borrar todos los clientes de la memoria?")) {
      setClients([]);
      localStorage.removeItem('belamarcoapp_db_v1');
      showSuccess("Memoria limpia");
    }
  };

  const handleDeleteClient = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      const updated = clients.filter(c => c.id !== id);
      saveToDatabase(updated);
      showSuccess("Cliente eliminado");
    }
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'BelaMarco APP',
        text: 'Accede a la gestión de clientes',
        url: currentUrl,
      }).catch(() => {
        navigator.clipboard.writeText(currentUrl);
        showSuccess("Enlace copiado");
      });
    } else {
      navigator.clipboard.writeText(currentUrl);
      showSuccess("Enlace copiado al portapapeles");
    }
  };

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;
    const s = searchTerm.toLowerCase();
    return clients.filter(c => 
      (c.name || '').toLowerCase().includes(s) ||
      (c.zone || '').toLowerCase().includes(s) ||
      (c.department || '').toLowerCase().includes(s) ||
      (c.address || '').toLowerCase().includes(s) ||
      (c.owner || '').toLowerCase().includes(s) ||
      (c.phone || '').includes(s)
    );
  }, [clients, searchTerm]);

  useEffect(() => { setDisplayLimit(20); }, [searchTerm]);

  const visibleClients = filteredClients.slice(0, displayLimit);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-primary text-primary-foreground p-6 rounded-b-[2.5rem] shadow-xl sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight">BelaMarcoAPP</h1>
            <p className="text-xs opacity-80 font-medium">{clients.length} clientes en memoria</p>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="rounded-full bg-white/10" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full bg-white/10" onClick={() => setActiveTab('settings')}>
              <Database className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar zona, ciudad, nombre..." 
            className="pl-11 pr-10 bg-white text-black rounded-2xl border-none h-14 shadow-2xl text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {activeTab === 'clients' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="font-bold text-slate-800">{searchTerm ? 'Resultados' : 'Cartera'}</h2>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">
                {filteredClients.length} MOSTRADOS
              </span>
            </div>

            {visibleClients.length > 0 ? (
              visibleClients.map(client => (
                <div key={client.id} onClick={() => setSelectedClient(client)} className="cursor-pointer active:scale-[0.98] transition-transform">
                  <ClientCard 
                    client={client} 
                    onEdit={(c) => { setEditingClient(c); setIsFormOpen(true); }} 
                    onDelete={handleDeleteClient}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-400 space-y-4">
                <p>{clients.length === 0 ? 'No hay clientes guardados.' : 'Sin resultados.'}</p>
                {clients.length === 0 && <Button onClick={() => setActiveTab('settings')} variant="outline">Importar JSON</Button>}
              </div>
            )}

            {filteredClients.length > displayLimit && (
              <Button variant="ghost" className="w-full text-primary font-bold py-6" onClick={() => setDisplayLimit(prev => prev + 50)}>
                Cargar más (+{filteredClients.length - displayLimit})
              </Button>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="font-bold text-xl px-2">Configuración</h2>
            
            <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-xl"><Smartphone className="h-6 w-6 text-blue-600" /></div>
                <h3 className="font-bold text-lg">Instalar en Pantalla de Inicio</h3>
              </div>
              
              <div className="grid gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Apple className="h-4 w-4" />
                    <span className="font-bold text-sm">Si usas iPhone (Safari)</span>
                  </div>
                  <ol className="text-xs space-y-2 text-slate-600 list-decimal pl-4">
                    <li>Pulsa el botón <b>Compartir</b> (cuadrado con flecha <Share2 className="inline h-3 w-3" />).</li>
                    <li>Busca y pulsa <b>"Añadir a pantalla de inicio"</b>.</li>
                  </ol>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">A</div>
                    <span className="font-bold text-sm">Si usas Android (Chrome)</span>
                  </div>
                  <ol className="text-xs space-y-2 text-slate-600 list-decimal pl-4">
                    <li>Pulsa los <b>tres puntos</b> de la esquina superior.</li>
                    <li>Pulsa <b>"Instalar aplicación"</b> o "Añadir a pantalla de inicio".</li>
                  </ol>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3 items-start">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-900">¡Importante!</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Asegúrate de abrir la URL pública (la que termina en .vercel.app). Si ves "localhost" en la barra de direcciones, el icono no funcionará en tu móvil.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-5 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg"><Database className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-sm font-bold">Base de Datos Local</p>
                    <p className="text-xs text-slate-500">{clients.length} clientes memorizados</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={handleClearData}><Trash2 className="h-5 w-5" /></Button>
              </div>
              <DataManagement clients={clients} onImport={handleImport} />
            </div>
          </div>
        )}
      </main>

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="sm:max-w-[500px] h-[90vh] flex flex-col p-0 overflow-hidden rounded-t-[2rem]">
          {selectedClient && (
            <>
              <div className="bg-primary p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div><h2 className="text-2xl font-bold">{selectedClient.name}</h2><p className="opacity-80 text-sm">{selectedClient.address}</p></div>
                  <Button variant="ghost" size="icon" className="text-white" onClick={() => setSelectedClient(null)}><ChevronRight className="h-6 w-6 rotate-90" /></Button>
                </div>
                <div className="flex gap-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{selectedClient.zone}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{selectedClient.department}</span>
                </div>
              </div>
              <Tabs defaultValue="actividad" className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b bg-white px-4">
                  <TabsTrigger value="actividad" className="flex-1">Actividad</TabsTrigger>
                  <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-y-auto p-4">
                  <TabsContent value="actividad" className="m-0">
                    <ActivityLog activities={selectedClient.activities || []} onAddActivity={(a) => {
                      const newActivity = { ...a, id: Math.random().toString(36).substr(2, 9) };
                      const updated = clients.map(c => c.id === selectedClient.id ? { ...c, activities: [...(c.activities || []), newActivity] } : c);
                      saveToDatabase(updated);
                      setSelectedClient(updated.find(c => c.id === selectedClient.id) || null);
                      showSuccess('Actividad registrada');
                    }} />
                  </TabsContent>
                  <TabsContent value="info" className="m-0 space-y-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Propietario</label><p className="font-medium">{selectedClient.owner}</p></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Teléfono</label><p className="font-medium">{selectedClient.phone}</p></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Notas</label><p className="text-sm text-slate-600">{selectedClient.notes || 'Sin notas'}</p></div>
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-t-3xl sm:rounded-lg">
          <DialogHeader><DialogTitle>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle></DialogHeader>
          <ClientForm client={editingClient} onSave={(data) => {
            let updated;
            if (editingClient) {
              updated = clients.map(c => c.id === data.id ? { ...c, ...data } : c);
              showSuccess('Ficha actualizada');
            } else {
              updated = [...clients, { ...data, id: Math.random().toString(36).substr(2, 9), activities: [], documents: [] }];
              showSuccess('Cliente registrado');
            }
            saveToDatabase(updated);
            setIsFormOpen(false);
          }} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onAddClick={() => { setEditingClient(null); setIsFormOpen(true); }} />
    </div>
  );
};

export default Index;