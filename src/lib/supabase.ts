"use client";

import { createClient } from '@supabase/supabase-js';

// Usamos las credenciales proporcionadas por el usuario
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://szxvddvetwsclekhwtjr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0-92M1xKSHpK08VdTkMT0w_iNJNi3D1';

// Verificamos si tenemos las credenciales mínimas
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exportamos una utilidad para saber si estamos conectados de verdad
export const isSupabaseReady = isConfigured;