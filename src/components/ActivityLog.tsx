import React, { useState } from 'react';
import { Activity } from '../types/client';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Calendar, MessageSquare, Phone, ShoppingBag, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ActivityLogProps {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
}

const ActivityLog = ({ activities = [], onAddActivity }: ActivityLogProps) => {
  const [newNote, setNewNote] = useState('');
  const [type, setType] = useState<Activity['type']>('nota');

  const handleSubmit = () => {
    if (!newNote.trim()) return;
    onAddActivity({
      date: new Date().toISOString(),
      type,
      description: newNote
    });
    setNewNote('');
  };

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'visita': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'llamada': return <Phone className="h-4 w-4 text-green-500" />;
      case 'venta': return <ShoppingBag className="h-4 w-4 text-amber-500" />;
      default: return <MessageSquare className="h-4 w-4 text-slate-500" />;
    }
  };

  // Aseguramos que activities sea un array antes de ordenar
  const safeActivities = Array.isArray(activities) ? [...activities] : [];

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-3 rounded-xl border space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['nota', 'visita', 'llamada', 'venta'] as const).map((t) => (
            <Button 
              key={t}
              variant={type === t ? 'default' : 'outline'} 
              size="sm" 
              className="capitalize rounded-full text-xs"
              onClick={() => setType(t)}
            >
              {t}
            </Button>
          ))}
        </div>
        <Textarea 
          placeholder="Escribe un reporte o nota..." 
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="bg-white min-h-[80px]"
        />
        <Button onClick={handleSubmit} className="w-full gap-2">
          <Plus className="h-4 w-4" /> Registrar Actividad
        </Button>
      </div>

      <div className="space-y-3">
        {safeActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((activity) => (
          <div key={activity.id} className="flex gap-3 p-3 bg-white rounded-lg border shadow-sm">
            <div className="mt-1">{getIcon(activity.type)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase text-slate-400">{activity.type}</span>
                <span className="text-[10px] text-slate-400">
                  {activity.date ? format(new Date(activity.date), "d MMM, HH:mm", { locale: es }) : ''}
                </span>
              </div>
              <p className="text-sm text-slate-700">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;