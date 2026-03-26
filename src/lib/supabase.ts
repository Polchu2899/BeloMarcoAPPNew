import { createClient } from '@supabase/supabase-js';

// Obtenemos las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si no existen, usamos valores temporales para que la app no se rompa al arrancar
// pero mostramos un aviso claro en la consola.
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.error("⚠️ CONFIGURACIÓN REQUERIDA: Supabase no está conectado correctamente. Por favor, asegúrate de haber completado la integración.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Exportamos una utilidad para saber si estamos conectados de verdad
export const isSupabaseReady = isConfigured;