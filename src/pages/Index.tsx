"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Map, Filter, Database, ChevronRight, Camera, FileText, Share2, Copy, Check, Monitor, Smartphone, AlertCircle, X, Trash2, Download, Apple, Info, User, MapPin, Phone, Mail, CreditCard, Receipt, Store, Hash, Navigation, Globe, Tag, Star, Cloud, CloudOff } from 'lucide-react';
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
import { supabase, isSupabaseReady } from '@/lib/supabase';

const Index = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('clients');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [displayLimit, setDisplayLimit] = useState(20);
  const [isOnline, setIsOnline] = useState(false);

  // Convierte Client (camelCase) al formato de columnas de Supabase (lowercase)
  const toSupabase = (client: Client) => ({
    id: client.id,
    name: client.name || '',
    address: client.address || '',
    lat: client.lat || '',
    lng: client.lng || '',
    phone: client.phone || '',
    phone2: client.phone2 || '',
    website: client.website || '',
    email: client.email || '',
    rating: client.rating || '',
    markercolor: client.markerColor || '',
    tags: client.tags || '',
    zones: client.zones || '',
    nif: client.nif || '',
    contact: client.contact || '',
    paymentmethod: client.paymentMethod || '',
    accountnumber: client.accountNumber || '',
    postalcode: client.postalCode || '',
    shippingaddress: client.shippingAddress || '',
    taxtype: client.taxType || '',
    shops: client.shops || '',
    notes: client.notes || '',
    activities: client.activities || [],
    documents: client.documents || [],
    updated_at: new Date().toISOString(),
  });

  // Convierte datos de Supabase (lowercase) de vuelta a Client (camelCase)
  const fromSupabase = (row: any): Client => ({
    id: row.id,
    name: row.name,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    phone: row.phone,
    phone2: row.phone2,
    website: row.website,
    email: row.email,
    rating: row.rating,
    markerColor: row.markercolor,
    tags: row.tags,
    zones: row.zones,
    nif: row.nif,
    contact: row.contact,
    paymentMethod: row.paymentmethod,
    accountNumber: row.accountnumber,
    postalCode: row.postalcode,
    shippingAddress: row.shippingaddress,
    taxType: row.taxtype,
    shops: row.shops,
    notes: row.notes,
    activities: row.activities || [],
    documents: row.documents || [],
  });

  const fetchClients = async () => {
    if (!isSupabaseReady) {
      const saved = localStorage.getItem('belamarcoapp_db_v1');
      if (saved) setClients(JSON.parse(saved));
      setIsOnline(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data) {
        setClients(data.map(fromSupabase));
        setIsOnline(true);
      }
    } catch (e) {
      console.error("Error cargando desde Supabase", e);
      setIsOnline(false);
      const saved = localStorage.getItem('belamarcoapp_db_v1');
      if (saved) setClients(JSON.parse(saved));
    }
  };

  useEffect(() => {
    fetchClients();

    if (isSupabaseReady) {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'clients' },
          () => fetchClients()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const saveToDatabase = async (newClient: Client) => {
    const updatedLocal = editingClient
      ? clients.map(c => c.id === newClient.id ? newClient : c)
      : [...clients, newClient];

    setClients(updatedLocal);
    localStorage.setItem('belamarcoapp_db_v1', JSON.stringify(updatedLocal));

    if (!isSupabaseReady) {
      showSuccess("Guardado localmente (Sin conexión a la nube)");
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .upsert(toSupabase(newClient));

      if (error) throw error;
      showSuccess("Sincronizado con la nube ✅");
      fetchClients();
    } catch (e) {
      showError("Error al sincronizar con la nube.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'BelaMarco APP',
      text: 'Gestiona tus clientes y rutas con BelaMarco APP',
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        showSuccess("Enlace copiado al portapapeles");
      }
    } catch (err) {
      console.log('Error al compartir', err);
    }
  };

  const handleImport = async (importedData: Client[]) => {
    if (!isSupabaseReady) {
      setClients(importedData);
      localStorage.setItem('belamarcoapp_db_v1', JSON.stringify(importedData));
      showSuccess(`${importedData.length} clientes guardados localmente`);
      return;
    }

    try {
      const dataToUpload = importedData.map(toSupabase);
      const { error } = await supabase.from('clients').upsert(dataToUpload);

      if (error) {
        console.error('Error Supabase:', error);
        showError(`Error: ${error.message}`);
        return;
      }

      showSuccess(`${importedData.length} clientes sincronizados con la nube ✅`);
      fetchClients();
      setActiveTab('clients');
    } catch (e: any) {
      console.error('Error al importar:', e);
      showError(`Error al importar: ${e?.message}`);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("¿Eliminar este cliente?")) {
      const updatedLocal = clients.filter(c => c.id !== id);
      setClients(updatedLocal);
      localStorage.setItem('belamarcoapp_db_v1', JSON.stringify(updatedLocal));

      if (isSupabaseReady) {
        try {
          await supabase.from('clients').delete().eq('id', id);
          showSuccess("Eliminado de la nube");
          fetchClients();
        } catch (e) {
          showError("Error al eliminar de la nube.");
        }
      } else {
        showSuccess("Eliminado localmente");
      }
    }
  };

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;
    const s = searchTerm.toLowerCase();
    return clients.filter(c =>
      (c.name || '').toLowerCase().includes(s) ||
      (c.zones || '').toLowerCase().includes(s) ||
      (c.nif || '').toLowerCase().includes(s) ||
      (c.address || '').toLowerCase().includes(s)
    );
  }, [clients, searchTerm]);

  const visibleClients = filteredClients.slice(0, displayLimit);

  const InfoRow = ({ icon: Icon, label, value, color = "text-slate-400" }: { icon: any, label: string, value?: string, color?: string }) => {
    if (!value || String(value).trim() === '' || value === 'undefined') return null;
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

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-primary text-primary-foreground p-6 rounded-b-[2.5rem] shadow-xl sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <Logo className="h-12" />
          <div className="flex gap-2">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isOnline ? <Cloud className="h-3 w-3" /> : <CloudOff className="h-3 w-3" />}
              {isOnline ? 'NUBE' : 'LOCAL'}
            </div>
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
            placeholder="Buscar por nombre, zona o NIF..."
            className="pl-11 pr-10 bg-white text-black rounded-2xl border-none h-14 shadow-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {activeTab === 'clients' && (
          <div className="space-y-4">
            {visibleClients.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No hay clientes. Importa un CSV en Ajustes.</p>
              </div>
            ) : (
              visibleClients.map(client => (
                <div key={client.id} onClick={() => setSelectedClient(client)} className="cursor-pointer">
                  <ClientCard client={client} onEdit={(c) => { setEditingClient(c); setIsFormOpen(true); }} onDelete={handleDeleteClient} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 bg-white rounded-2xl border shadow-sm">
            <h2 className="font-bold mb-4">Configuración</h2>
            <DataManagement clients={clients} onImport={handleImport} />
            <Button
              variant="destructive"
              className="w-full mt-8 gap-2"
              onClick={() => { if(confirm("¿Borrar todos los datos?")) { localStorage.removeItem('belamarcoapp_db_v1'); setClients([]); showSuccess("Base de datos borrada"); } }}
            >
              <Trash2 className="h-4 w-4" /> Borrar Base de Datos
            </Button>
          </div>
        )}
      </main>

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="sm:max-w-[500px] h-[90vh] flex flex-col p-0 overflow-hidden rounded-t-[2rem]">
          {selectedClient && (
            <>
              <div className="bg-primary p-6 text-white shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                    <p className="opacity-80 text-sm flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedClient.address}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white" onClick={() => setSelectedClient(null)}><X className="h-5 w-5" /></Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedClient.paymentMethod && <span className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{selectedClient.paymentMethod}</span>}
                  {selectedClient.nif && <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{selectedClient.nif}</span>}
                </div>
              </div>
              <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full justify-start rounded-none border-b bg-white px-4">
                  <TabsTrigger value="info" className="flex-1">Información</TabsTrigger>
                  <TabsTrigger value="actividad" className="flex-1">Actividad</TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-y-auto bg-white p-6">
                  <TabsContent value="info" className="m-0 space-y-1">
                    <InfoRow icon={User} label="Nombre del Negocio" value={selectedClient.name} color="text-blue-500" />
                    <InfoRow icon={MapPin} label="Dirección Principal" value={selectedClient.address} color="text-red-500" />
                    <InfoRow icon={Phone} label="Teléfono 1" value={selectedClient.phone} color="text-green-500" />
                    <InfoRow icon={Phone} label="Teléfono 2" value={selectedClient.phone2} color="text-green-600" />
                    <InfoRow icon={Mail} label="E-mail" value={selectedClient.email} color="text-amber-500" />
                    <InfoRow icon={Hash} label="NIF / CIF / DNI" value={selectedClient.nif} color="text-slate-700" />
                    <InfoRow icon={User} label="Persona de Contacto" value={selectedClient.contact} color="text-indigo-500" />
                    <InfoRow icon={Receipt} label="IBAN / Nº Cuenta" value={selectedClient.accountNumber} color="text-blue-700" />
                    <InfoRow icon={CreditCard} label="Forma de Pago" value={selectedClient.paymentMethod} color="text-amber-600" />
                    <InfoRow icon={Hash} label="Código Postal" value={selectedClient.postalCode} color="text-slate-700" />
                    <InfoRow icon={MapPin} label="Dirección de Envío" value={selectedClient.shippingAddress} color="text-slate-500" />
                    <InfoRow icon={Receipt} label="IVA / RE" value={selectedClient.taxType} color="text-slate-700" />
                    <InfoRow icon={Store} label="Botigues" value={selectedClient.shops} color="text-slate-700" />
                    <InfoRow icon={Tag} label="Zonas" value={selectedClient.zones} color="text-purple-500" />
                    <InfoRow icon={FileText} label="Notas" value={selectedClient.notes} color="text-slate-400" />
                  </TabsContent>
                  <TabsContent value="actividad" className="m-0">
                    <ActivityLog activities={selectedClient.activities || []} onAddActivity={async (a) => {
                      const newActivity = { ...a, id: Date.now().toString() };
                      const updatedClient = {
                        ...selectedClient,
                        activities: [...(selectedClient.activities || []), newActivity]
                      };
                      await saveToDatabase(updatedClient);
                      setSelectedClient(updatedClient);
                    }} />
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col p-0 overflow-hidden rounded-t-3xl">
          <div className="p-6 border-b"><DialogTitle>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle></div>
          <div className="flex-1 overflow-hidden p-6">
            <ClientForm client={editingClient} onSave={async (data) => {
              await saveToDatabase(data);
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
