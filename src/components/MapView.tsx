"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Client } from '../types/client';
import { Button } from './ui/button';
import { Navigation, Phone } from 'lucide-react';

// Corregir iconos de Leaflet que a veces no cargan en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
}

// Componente para centrar el mapa automáticamente
const RecenterMap = ({ clients }: { clients: Client[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (clients.length > 0) {
      const validClients = clients.filter(c => c.lat && c.lng);
      if (validClients.length > 0) {
        const bounds = L.latLngBounds(validClients.map(c => [parseFloat(c.lat!), parseFloat(c.lng!)]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [clients, map]);
  
  return null;
};

const MapView = ({ clients, onSelectClient }: MapViewProps) => {
  const validClients = clients.filter(c => c.lat && c.lng && !isNaN(parseFloat(c.lat)) && !isNaN(parseFloat(c.lng)));

  const handleNavigate = (address: string) => {
    window.location.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <div className="h-[calc(100vh-280px)] w-full rounded-2xl overflow-hidden border shadow-inner bg-slate-100 relative z-0">
      {validClients.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
            <Navigation className="h-8 w-8 opacity-20" />
          </div>
          <p className="font-medium">No hay clientes con coordenadas</p>
          <p className="text-xs mt-2">Edita un cliente y asegúrate de que tenga latitud y longitud para que aparezca aquí.</p>
        </div>
      ) : (
        <MapContainer 
          center={[40.416775, -3.703790]} 
          zoom={6} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap clients={validClients} />
          {validClients.map((client) => (
            <Marker 
              key={client.id} 
              position={[parseFloat(client.lat!), parseFloat(client.lng!)]}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-bold text-sm mb-1">{client.name}</h3>
                  <p className="text-[10px] text-slate-500 mb-3 leading-tight">{client.address}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="h-7 text-[10px] flex-1 gap-1"
                      onClick={() => onSelectClient(client)}
                    >
                      Ver Ficha
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 text-[10px] flex-1 gap-1"
                      onClick={() => handleNavigate(client.address)}
                    >
                      <Navigation className="h-3 w-3" /> Ir
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default MapView;