import React, { useState, useEffect } from 'react';
import { Client } from '../types/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

interface ClientFormProps {
  client?: Client | null;
  onSave: (client: Client) => void;
  onCancel: () => void;
}

const ClientForm = ({ client, onSave, onCancel }: ClientFormProps) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    owner: '',
    address: '',
    department: '',
    zone: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: client?.id || Math.random().toString(36).substr(2, 9),
    } as Client);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre del Negocio/Cliente</Label>
          <Input 
            id="name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="owner">Propietario / Contacto</Label>
          <Input 
            id="owner" 
            value={formData.owner} 
            onChange={(e) => setFormData({...formData, owner: e.target.value})} 
            required 
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Dirección Completa</Label>
          <Input 
            id="address" 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})} 
            required 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="department">Departamento</Label>
            <Input 
              id="department" 
              value={formData.department} 
              onChange={(e) => setFormData({...formData, department: e.target.value})} 
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zone">Zona</Label>
            <Input 
              id="zone" 
              value={formData.zone} 
              onChange={(e) => setFormData({...formData, zone: e.target.value})} 
              required 
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input 
            id="phone" 
            type="tel"
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            required 
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notas adicionales</Label>
          <Textarea 
            id="notes" 
            value={formData.notes} 
            onChange={(e) => setFormData({...formData, notes: e.target.value})} 
          />
        </div>
      </div>
      <DialogFooter className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Guardar Cambios</Button>
      </DialogFooter>
    </form>
  );
};

export default ClientForm;