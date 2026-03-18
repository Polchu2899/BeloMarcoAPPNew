import React from 'react';
import { Users, Map as MapIcon, Settings, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

const BottomNav = ({ activeTab, onTabChange, onAddClick }: BottomNavProps) => {
  const tabs = [
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'map', label: 'Mapa', icon: MapIcon },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 flex justify-between items-center z-50 pb-safe">
      {tabs.slice(0, 2).map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            activeTab === tab.id ? "text-primary" : "text-slate-400"
          )}
        >
          <tab.icon className="h-6 w-6" />
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}

      <button 
        onClick={onAddClick}
        className="bg-primary text-white p-3 rounded-full -mt-8 shadow-lg border-4 border-slate-50 active:scale-95 transition-transform"
      >
        <PlusCircle className="h-7 w-7" />
      </button>

      {tabs.slice(2).map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            activeTab === tab.id ? "text-primary" : "text-slate-400"
          )}
        >
          <tab.icon className="h-6 w-6" />
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;