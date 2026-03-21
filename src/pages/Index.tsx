"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Map, Filter, Database, ChevronRight, Camera, FileText, Share2, Copy, Check, Monitor, Smartphone, AlertCircle, X, Trash2, Download, Apple, Info, User, MapPin, Phone, Mail, CreditCard, Receipt, Store, Hash, Navigation, Globe } from 'lucide-react';
import { Client, Activity } from '../types/client';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';
import DataManagement from '../components/DataManagement';
import ActivityLog from '../components/ActivityLog';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';
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
      id: c.id || c.Id || Math.random().toString(36).substr(2, 9),
      name: c.name || c.Nombre || 'Sin Nombre',
      address: c.address || c.Dirección || 'Sin Dirección',
      phone: String(c.phone || c.Teléfono || ''),
      phone2: String(c.phone2 || c.Teléfono2 || ''),
      phone3: String(c.phone3 || c.Teléfono3 || ''),
      phone4: String(c.phone4 || c.Teléfono4 || ''),
      email: c.email || c.Email || '',
      lat: c.lat || c.Latitud || '',
      lng: c.lng || c.Longitud || '',
      website: c.website || c.Website || '',
      rating: c.rating || c.Valoración || '',
      tags: c.tags || c.Etiquetas || '',
      zones: c.zones || c.Zonas || '',
      nif: c.nif || c['Campo personalizado 1 (NIF/CIF)'] || '',
      contact: c.contact || c['Campo personalizado 2 (CONTACTO)'] || '',
      paymentMethod: c.paymentMethod || c['Campo personalizado 3 (FORMA DE PAGO)'] || '',
      accountNumber: c.accountNumber || c['Campo personalizado 4 (NUMERO DE CUENTA)'] || '',
      postalCode: c.postalCode || c['Campo personalizado 5 (CODIGO POSTAL)'] || '',
      shippingAddress: c.shippingAddress || c['Campo personalizado 6 (DIRECCION DE ENVIO)'] || '',
      taxType: c.taxType || c['Campo personalizado 7 (IVA/RE)'] || '',
      shops: c.shops || c['Campo personalizado 8 (BOTIGUES)'] || '',
      activities: Array.isArray(c.activities) ? c.activities : [],
      documents: Array.isArray(c.documents) ? c.documents : [],
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
      (c.zones || '').toLowerCase().includes(s) ||
      (c.address || '').toLowerCase().includes(s) ||
      (c.contact || '').toLowerCase().includes(s) ||
      (c.phone || '').includes(s) ||
      (c.nif || '').toLowerCase().includes(s) ||
      (c.paymentMethod || '').toLowerCase().includes(s)
    );
  }, [clients, searchTerm]);

  useEffect(() => { setDisplayLimit(20); }, [searchTerm]);

  const visibleClients = filteredClients.slice(0, displayLimit);

  const InfoRow = ({ icon: Icon, label, value, color = "text-slate-400" }: { icon: any, label: string, value?: string, color?: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0">
        <div className={`${color} mt-1 shrink-0`}><Icon className="h-5 w-5" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
          <p className="text-sm font-medium text-slate-700 break-words">{value}</p>
        </div>
      </div>
    );
  };

  // Función para determinar si es NIF o DNI
  const getDocLabel = (doc: string) => {
    if (!doc) return "NIF / DNI";
    const firstChar = doc.charAt(0).toUpperCase();
    const lastChar = doc.charAt(doc.length - 1).toUpperCase();
    if (/[A-Z]/.test(firstChar)) return "NIF / CIF";
    if (/[A-Z]/.test(lastChar)) return "DNI";
    return "NIF / DNI";
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-primary text-primary-foreground p-6 rounded-b-[2.5rem] shadow-xl sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-1">
            <Logo className="h-12" />
            <p className="text-[10px] opacity-70 font-medium ml-1">{clients.length} clientes en cartera</p>
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
            placeholder="Buscar por nombre, zona, NIF, pago..." 
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
                {clients.length === 0 && <Button onClick={() => setActiveTab('settings')} variant="outline">Importar CSV</Button>}
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
              <div className="bg-primary p-6 text-white shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-bold leading-tight">{selectedClient.name}</h2>
                    <p className="opacity-80 text-sm mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {selectedClient.address}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white rounded-full bg-white/10" onClick={() => setSelectedClient(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedClient.paymentMethod && <span className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{selectedClient.paymentMethod}</span>}
                  {selectedClient.zones && <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{selectedClient.zones}</span>}
                  {selectedClient.nif && <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{selectedClient.nif}</span>}
                </div>
              </div>
              <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full justify-start rounded-none border-b bg-white px-4 shrink-0">
                  <TabsTrigger value="info" className="flex-1">Información</TabsTrigger>
                  <TabsTrigger value="actividad" className="flex-1">Actividad</TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-y-auto bg-white">
                  <TabsContent value="info" className="m-0 p-6 space-y-1">
                    <InfoRow icon={User} label="Nombre" value={selectedClient.name} color="text-blue-500" />
                    <InfoRow icon={MapPin} label="Dirección" value={selectedClient.address} color="text-red-500" />
                    <InfoRow icon={Phone} label="Teléfono 1" value={selectedClient.phone} color="text-green-500" />
                    <InfoRow icon={Phone} label="Teléfono 2" value={selectedClient.phone2} color="text-green-600" />
                    <InfoRow icon={Mail} label="E-mail" value={selectedClient.email} color="text-amber-500" />
                    <InfoRow icon={Hash} label={getDocLabel(selectedClient.nif || '')} value={selectedClient.nif} color="text-slate-700" />
                    <InfoRow icon={User} label="Contacto" value={selectedClient.contact} color="text-indigo-500" />
                    <InfoRow icon={CreditCard} label="Forma de Pago" value={selectedClient.paymentMethod} color="text-amber-600" />
                    <InfoRow icon={Receipt} label="IBAN / Número de Cuenta" value={selectedClient.accountNumber} color="text-blue-700" />
                    <InfoRow icon={Hash} label="Código Postal" value={selectedClient.postalCode} color="text-slate-700" />
                    <InfoRow icon={MapPin} label="Dirección de Envío" value={selectedClient.shippingAddress} color="text-slate-500" />
                    <InfoRow icon={Receipt} label="IVA / RE" value={selectedClient.taxType} color="text-slate-700" />
                    <InfoRow icon={Store} label="Botigues" value={selectedClient.shops} color="text-slate-700" />
                    <InfoRow icon={Globe} label="Website" value={selectedClient.website} color="text-blue-400" />
                    <InfoRow icon={FileText} label="Notas" value={selectedClient.notes} color="text-slate-400" />
                  </TabsContent>
                  <TabsContent value="actividad" className="m-0 p-4">
                    <ActivityLog activities={selectedClient.activities || []} onAddActivity={(a) => {
                      const newActivity = { ...a, id: Math.random().toString(36).substr(2, 9) };
                      const updated = clients.map(c => c.id === selectedClient.id ? { ...c, activities: [...(c.activities || []), newActivity] } : c);
                      saveToDatabase(updated);
                      setSelectedClient(updated.find(c => c.id === selectedClient.id) || null);
                      showSuccess('Actividad registrada');
                    }} />
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col p-0 overflow-hidden rounded-t-3xl sm:rounded-lg">
          <div className="p-6 border-b shrink-0">
            <DialogTitle>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
          </div>
          <div className="flex-1 overflow-hidden p-6">
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
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onAddClick={() => { setEditingClient(null); setIsFormOpen(true); }} />
    </div>
  );
};

export default Index;