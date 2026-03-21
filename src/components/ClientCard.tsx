"use client";

import React from 'react';
import { MapPin, User, Phone, Edit, Navigation, Compass, Trash2, CreditCard } from 'lucide-react';
import { Client } from '../types/client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientCard = ({ client, onEdit, onDelete }: ClientCardProps) => {
  const openInMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const encodedAddress = encodeURIComponent(client.address);
    window.location.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };

  const openInWaze = (e: React.MouseEvent) => {
    e.stopPropagation();
    const encodedAddress = encodeURIComponent(client.address);
    window.location.href = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${client.phone}`;
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(client);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(client.id);
  };

  return (
    <Card className="mb-4 overflow-hidden border-l-4 border-l-primary shadow-md bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-primary">{client.name}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8 text-slate-500">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="mr-1 h-3 w-3" />
          <span>{client.contact || 'Sin contacto'}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-1 h-4 w-4 text-destructive shrink-0" />
          <p className="leading-tight text-slate-600">{client.address}</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {client.paymentMethod && (
            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <CreditCard className="h-3 w-3" /> {client.paymentMethod}
            </span>
          )}
          {client.zones && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Zona: {client.zones}
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="flex-1 gap-2 rounded-xl h-12 shadow-sm" 
                onClick={(e) => e.stopPropagation()}
              >
                <Navigation className="h-4 w-4" />
                Navegar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48 p-2 rounded-xl shadow-2xl border-slate-200">
              <DropdownMenuItem onClick={openInMaps} className="gap-3 py-3 cursor-pointer rounded-lg">
                <Compass className="h-5 w-5 text-blue-600" /> 
                <span className="font-medium">Google Maps</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openInWaze} className="gap-3 py-3 cursor-pointer rounded-lg">
                <div className="h-5 w-5 bg-cyan-400 rounded-full flex items-center justify-center text-[10px] text-white font-bold">W</div>
                <span className="font-medium">Waze</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="outline" 
            className="flex-1 gap-2 rounded-xl h-12 border-slate-200"
            onClick={handleCall}
          >
            <Phone className="h-4 w-4 text-green-600" />
            Llamar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;