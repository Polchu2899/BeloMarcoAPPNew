"use client";

import React, { useState, useEffect } from 'react';
import { Client } from '../types/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface ClientFormProps {
  client?: Client | null;
  onSave: (client: Client) => void;
  onCancel: () => void;
}

const ClientForm = ({ client, onSave, onCancel }: ClientFormProps) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    address: '',
    phone: '',
    phone2: '',
    email: '',
    nif: '',
    contact: '',
    paymentMethod: '',
    accountNumber: '',
    postalCode: '',
    shippingAddress: '',
    taxType: '',
    shops: '',
    zones: '',
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
      activities: client?.activities || [],
      documents: client?.documents || []
    } as Client);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-1">
        <div className="space-y-4 py-4">
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
            <Label htmlFor="address">Dirección</Label>
            <Input 
              id="address" 
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono 1</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone2">Teléfono 2</Label>
              <Input 
                id="phone2" 
                value={formData.phone2} 
                onChange={(e) => setFormData({...formData, phone2: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nif">NIF / CIF</Label>
              <Input 
                id="nif" 
                value={formData.nif} 
                onChange={(e) => setFormData({...formData, nif: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input 
                id="postalCode" 
                value={formData.postalCode} 
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact">Contacto</Label>
            <Input 
              id="contact" 
              value={formData.contact} 
              onChange={(e) => setFormData({...formData, contact: e.target.value})} 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Forma de Pago</Label>
            <Input 
              id="paymentMethod" 
              value={formData.paymentMethod} 
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="accountNumber">Número de Cuenta</Label>
            <Input 
              id="accountNumber" 
              value={formData.accountNumber} 
              onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="taxType">IVA / RE</Label>
              <Input 
                id="taxType" 
                value={formData.taxType} 
                onChange={(e) => setFormData({...formData, taxType: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shops">Botigues</Label>
              <Input 
                id="shops" 
                value={formData.shops} 
                onChange={(e) => setFormData({...formData, shops: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="zones">Zonas</Label>
            <Input 
              id="zones" 
              value={formData.zones} 
              onChange={(e) => setFormData({...formData, zones: e.target.value})} 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={(e) => setFormData({...formData, notes: e.target.value})} 
            />
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className="flex gap-2 pt-4 mt-2 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Guardar</Button>
      </DialogFooter>
    </form>
  );
};

export default ClientForm;