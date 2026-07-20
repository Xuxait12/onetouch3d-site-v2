import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Loader2, Search, X, ZoomIn, Medal } from 'lucide-react';

const WHATSAPP_NUMERO = '5554999924547';

type Prova = {
  id: string;
  nome: string;
  cidade: string | null;
  pais: string | null;
  logo_url: string | null;
  ativo: boolean;
  ordem: number;
};

type EstiloValue = 'clean' | 'dinamico' | 'editorial' | 'numero_atleta' | 'slim';

type ProvaEstilo = {
  id: string;
  prova_id: string;
  estilo: EstiloValue;
  imagem_url: string | null;
  tamanho: string | null;
  preco_a_partir: number | null;
  ativo: boolean;
};

const ESTILO_LABELS: Record<EstiloValue, string> = {
  clean: 'Clean',
  dinamico: 'Panorama',
  editorial: 'Mapa',
  numero_atleta: 'Número',
  slim: 'Slim',
};

const ESTILO_DESCRICOES: Record<EstiloValue, string> = {
  clean: 'Foto - Dados prova - Percurso prova 3D - Medalha',
  dinamico: 'Fotos - Dados prova - Percurso prova 3D - Medalha',
  editorial: 'Fotos - Dados prova - Percurso prova 3D - Medalha',
  numero_atleta: 'Fotos - Número peito original - Dados prova - Medalha',
  slim: 'Foto - Dados prova - BID – Número peito redesenhado - Medalha',
};

function formatTamanho(tamanho: string | null) {
  return tamanho ? `Tamanho: ${tamanho}` : null;
}

function formatValor(preco: number | null) {
  return `Valor: ${preco == null ? 'Consulte no WhatsApp' : preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
}

function whatsappLink(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export default function CatalogoCorrida() {
  const [provaAbertaId, setProvaAbertaId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const { data: provas = [], isLoading: loadingProvas } = useQuery({
    queryKey: ['catalogo-provas-publico'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('provas_catalogo')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true })
        .order('nome', { ascending: true });
      if (error) throw error;
      return (data || []) as Prova[];
    },
  });

  const { data: estilos = [], isLoading: loadingEstilos } = useQuery({
    queryKey: ['catalogo-estilos-publico'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('provas_estilos')
        .select('*')
        .eq('ativo', true);
      if (error) throw error;
      return (data || []) as ProvaEstilo[];
    },
  });

  const isLoading = loadingProvas || loadingEstilos;
  const estilosDaProva = (provaId: string) => estilos.filter((e) => e.prova_id === provaId);

  const toggleProva = (id: string) => {
    setProvaAbertaId((atual) => (atual === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-transparent">
      <GlobalHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Catálogo de Corrida
          </p>
          <h1 className="text-2xl md:text-4xl font-bold mb-4">Encontre sua prova</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha o modelo que mais combina com você.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            Não se preocupe com o ano ou a distância da sua prova — o modelo do seu quadro será aquele que você escolher, e nós personalizamos com a medalha, o percurso e os dados da sua edição.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {provas.map((p) => {
                const aberta = provaAbertaId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProva(p.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                      aberta
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border/50 bg-card hover:border-border hover:shadow-sm'
                    }`}
                  >
                    <div className="w-full aspect-[2/1] flex items-center justify-center rounded-lg bg-white p-2 overflow-hidden shrink-0">
                      {p.logo_url ? (
                        <img src={p.logo_url} alt={p.nome} className="max-h-full max-w-full object-contain" loading="lazy" />
                      ) : (
                        <Medal className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <span className={`text-xs md:text-sm text-center leading-tight ${aberta ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                      {p.nome}
                    </span>
                  </button>
                );
              })}

              {/* Card fallback - sempre visível no final do grid */}
              <a
                href={whatsappLink('Olá! Não encontrei minha prova no catálogo, vocês produzem também?')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-border/60 hover:border-border hover:bg-muted/20 transition-all duration-200 text-center"
              >
                <div className="w-full aspect-[2/1] flex items-center justify-center rounded-lg bg-muted/30 shrink-0">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-xs md:text-sm text-muted-foreground leading-tight">Não achou sua prova?</span>
              </a>
            </div>

            {provas.length === 0 && (
              <p className="text-center text-muted-foreground mt-8">
                Estamos organizando o catálogo — em breve as provas aparecem aqui.
              </p>
            )}

            {/* Painel expandido com os estilos da prova selecionada */}
            {provaAbertaId && (() => {
              const prova = provas.find((p) => p.id === provaAbertaId);
              if (!prova) return null;
              const lista = estilosDaProva(prova.id);
              return (
                <div className="mt-6 md:mt-8 rounded-2xl border border-border/50 bg-card p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4 md:mb-5">
                    <h2 className="text-base md:text-lg font-semibold">{prova.nome}</h2>
                    <button
                      onClick={() => setProvaAbertaId(null)}
                      className="p-1.5 rounded-full hover:bg-muted/50 text-muted-foreground"
                      aria-label="Fechar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {lista.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      Ainda estamos preparando os estilos para essa prova. Fale com a gente no WhatsApp!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {lista.map((e) => (
                        <div key={e.id} className="rounded-xl border border-border/50 overflow-hidden bg-background">
                          <div className="relative aspect-[4/3] bg-muted/30">
                            {e.imagem_url ? (
                              <button
                                onClick={() => setLightboxUrl(e.imagem_url)}
                                className="block w-full h-full"
                                aria-label="Ampliar imagem"
                              >
                                <img src={e.imagem_url} alt={ESTILO_LABELS[e.estilo]} className="w-full h-full object-cover" loading="lazy" />
                                <span className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 flex items-center justify-center">
                                  <ZoomIn className="h-4 w-4 text-white" />
                                </span>
                              </button>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                Imagem em breve
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium mb-1">
                              {ESTILO_LABELS[e.estilo]}
                            </p>
                            <ul className="mb-2 space-y-0.5">
                              {ESTILO_DESCRICOES[e.estilo].split(' - ').map((item) => (
                                <li key={item} className="text-xs text-muted-foreground/80 leading-snug">
                                  · {item}
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs font-bold mb-3">
                              {formatTamanho(e.tamanho) && <>{formatTamanho(e.tamanho)}<br /></>}
                              {formatValor(e.preco_a_partir)}
                            </p>
                            <a
                              href={whatsappLink(`Olá! Quero saber mais sobre o quadro ${ESTILO_LABELS[e.estilo]} da prova ${prova.nome}!`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 w-full text-xs font-medium border border-border rounded-md py-2 hover:bg-muted/40 transition-colors"
                            >
                              Quero - Fale conosco
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </>
        )}
      </main>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <img src={lightboxUrl} alt="Modelo ampliado" className="max-w-full max-h-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <GlobalFooter />
      <WhatsAppButton />
    </div>
  );
}
