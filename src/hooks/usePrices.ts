import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TAMANHOS, TIPOS_MOLDURA } from '@/lib/catalog';

// Inverse maps: UUID → label/key
const TAMANHO_BY_ID: Record<string, string> = {};
for (const [label, id] of Object.entries(TAMANHOS)) {
  TAMANHO_BY_ID[id] = label;
}

const TIPO_MOLDURA_BY_ID: Record<string, string> = {};
for (const [key, id] of Object.entries(TIPOS_MOLDURA)) {
  TIPO_MOLDURA_BY_ID[id] = key;
}

interface PriceEntry {
  preco: number;
  tamanho_id: string;
  tipo_moldura_id: string;
}

interface PriceResult {
  fullPrice: number;
  pixPrice: number;
  tamanho_id: string;
  tipo_moldura_id: string;
}

// Size sort order
const SIZE_ORDER = [
  '33x33', '33x43', '37x48', '43x43', '43x53',
  '43x63', '53x53', '53x73', '63x83', '83x103',
];

export function usePrices(modalidade_id: string) {
  const [entries, setEntries] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrices() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('precos')
        .select('preco, tamanho_id, tipo_moldura_id')
        .eq('modalidade_id', modalidade_id)
        .eq('ativo', true);

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      setEntries((data as PriceEntry[]) || []);
      setLoading(false);
    }

    fetchPrices();
    return () => { cancelled = true; };
  }, [modalidade_id]);

  /** Get price for a specific size label + frame type key. Returns null if not found or price <= 0. */
  const getPrice = (tamanhoLabel: string, tipoMolduraKey: string): PriceResult | null => {
    const tamanhoId = TAMANHOS[tamanhoLabel];
    const tipoId = TIPOS_MOLDURA[tipoMolduraKey as keyof typeof TIPOS_MOLDURA];
    if (!tamanhoId || !tipoId) return null;

    const entry = entries.find(
      (e) => e.tamanho_id === tamanhoId && e.tipo_moldura_id === tipoId
    );
    if (!entry || entry.preco <= 0) return null;

    return {
      fullPrice: entry.preco,
      pixPrice: Math.round(entry.preco * 0.95 * 100) / 100,
      tamanho_id: entry.tamanho_id,
      tipo_moldura_id: entry.tipo_moldura_id,
    };
  };

  /** Get sorted list of available size labels (with price > 0) for a frame type key */
  const getAvailableSizes = (tipoMolduraKey: string): string[] => {
    const tipoId = TIPOS_MOLDURA[tipoMolduraKey as keyof typeof TIPOS_MOLDURA];
    if (!tipoId) return [];

    const labels = entries
      .filter((e) => e.tipo_moldura_id === tipoId && e.preco > 0)
      .map((e) => TAMANHO_BY_ID[e.tamanho_id])
      .filter(Boolean);

    return labels.sort(
      (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
    );
  };

  /** Check if a size exists in DB with price <= 0 (quote-only) */
  const isQuoteOnly = (tamanhoLabel: string, tipoMolduraKey: string): boolean => {
    const tamanhoId = TAMANHOS[tamanhoLabel];
    const tipoId = TIPOS_MOLDURA[tipoMolduraKey as keyof typeof TIPOS_MOLDURA];
    if (!tamanhoId || !tipoId) return false;

    const entry = entries.find(
      (e) => e.tamanho_id === tamanhoId && e.tipo_moldura_id === tipoId
    );
    return !!entry && entry.preco <= 0;
  };

  return { loading, error, getPrice, getAvailableSizes, isQuoteOnly };
}
