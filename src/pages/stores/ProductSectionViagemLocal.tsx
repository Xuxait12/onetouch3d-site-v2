import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShippingOption } from "@/types/shipping";
import { Loader2, Package, Clock } from "lucide-react";

const ProductSectionViagemLocal = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState("preta-branca");
  const [selectedSize, setSelectedSize] = useState("33x43cm");
  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Save current store page for coupon validation
  useEffect(() => {
    localStorage.setItem('lastStorePage', 'viagem');
  }, []);

  // OPÇÕES ESPECÍFICAS DA LOJA VIAGEM
  const colorOptions = [
    { value: "preta-branca", label: "Preta/branca" }
  ];

  // TAMANHOS E PREÇOS ESPECÍFICOS DA LOJA VIAGEM
  const sizeOptions = [
    { size: "33x43cm", fullPrice: 407.50, pixPrice: 382.50, isQuote: false },
    { size: "37x48cm", fullPrice: 438.20, pixPrice: 413.20, isQuote: false },
    { size: "43x53cm", fullPrice: 486.30, pixPrice: 451.30, isQuote: false },
    { size: "53x73cm", fullPrice: 658.70, pixPrice: 623.70, isQuote: false },
    { size: "63x83cm", fullPrice: 0, pixPrice: 0, isQuote: true },
    { size: "83x103cm", fullPrice: 0, pixPrice: 0, isQuote: true }
  ];

  // IMAGENS ESPECÍFICAS POR TAMANHO - LOJA VIAGEM
  const productImages: Record<string, string> = {
    "33x43cm": "/images/viagem-33x43-caixa-alta.webp",
    "37x48cm": "/images/viagem-37x48-caixa-alta.webp",
    "43x53cm": "/images/viagem-43x53-caixa-alta.webp",
    "53x73cm": "/images/viagem-53x73-caixa-alta.webp",
    "63x83cm": "/images/viagem-103x83-caixa-alta.webp",
    "83x103cm": "/images/viagem-103x83-caixa-alta.webp",
  };

  const getCurrentImage = () => {
    return productImages[selectedSize] || productImages["33x43cm"];
  };

  const productImage = getCurrentImage();

  const currentSizeOption = sizeOptions.find(option => option.size === selectedSize) || sizeOptions[0];
  
  const fullPrice = currentSizeOption.fullPrice;
  const finalPrice = currentSizeOption.pixPrice;
  const installmentPrice = (fullPrice / 12).toFixed(2);

  const handleAddToCart = () => {
    const productName = "Quadro Caixa Alta - Viagem";
    const colorDisplay = "Preta/Branca";
    
    addItem({
      nome: productName,
      cor: colorDisplay,
      tamanho: selectedSize,
      quantidade: 1,
      precoUnitario: finalPrice,
      imagem: productImage,
    });

    toast({
      title: "Produto adicionado ao carrinho!",
      description: `${productName} ${selectedSize} ${colorDisplay}`,
    });
  };

  const handleCalculateFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (!cepLimpo || cepLimpo.length !== 8) {
      toast({
        variant: "destructive",
        title: "CEP inválido",
        description: "Digite um CEP válido com 8 dígitos"
      });
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);
    setShippingOptions([]);

    try {
      const currentSizeOption = sizeOptions.find(option => option.size === selectedSize) || sizeOptions[0];

      const { data, error } = await supabase.functions.invoke('calculate-shipping', {
        body: {
          cep_destino: cepLimpo,
          items: [{
            tamanho: selectedSize,
            quantidade: 1,
            subtotal: currentSizeOption.pixPrice
          }]
        }
      });

      if (error) throw error;

      if (data.success) {
        setShippingOptions(data.options);
        if (data.fallback) {
          toast({
            title: "Atenção",
            description: data.message || "Usando valor padrão de frete"
          });
        }
      } else {
        throw new Error(data.error || 'Erro ao calcular frete');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Não foi possível calcular o frete. Tente novamente.';
      setShippingError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erro ao calcular frete",
        description: errorMessage
      });
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  return (
    <section id="nossa-loja" data-section="nossa-loja" className="pb-12 sm:pb-16 product-section" style={{ background: 'transparent !important' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8" style={{ background: 'transparent !important' }}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">NOSSA LOJA</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            <div className="space-y-6 sm:space-y-8">
              <div className="relative">
                <img 
                  src={productImage}
                  alt="Moldura Premium para viagem"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <Card className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Características da Moldura Caixa Alta
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Acabamento sofisticado:</strong> Madeira com revestimento PET texturizado em preto e interno liso branco.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Dimensões:</strong> Espessura 5,2cm (distância da parede) e largura 3,1cm (frontal).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Materiais de qualidade:</strong> Madeira + fundo em MDF 3mm.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Design moderno:</strong> Combinação preta externa e branca interna.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Proteção:</strong> Vidro 3mm no tamanho da moldura.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Envio seguro:</strong> Embalagem reforçada com papelão e isopor.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Kit instalação:</strong> Pendurador, parafuso, bucha e fita 3M.</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Quadro Caixa Alta</h2>
                <p className="text-blue-600 font-medium text-sm sm:text-base">COM percurso em alto relevo (3D)</p>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Cor da Moldura</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                  <div className="flex gap-3">
                    {colorOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`viagem-color-${option.value}`} />
                        <Label htmlFor={`viagem-color-${option.value}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Tamanho</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {sizeOptions.map((option) => (
                      <div 
                        key={option.size} 
                        className="flex items-center space-x-2 p-2 -m-1 cursor-pointer touch-manipulation rounded-md hover:bg-muted/50 active:bg-muted transition-colors"
                        onClick={() => setSelectedSize(option.size)}
                      >
                        <RadioGroupItem value={option.size} id={`viagem-size-${option.size}`} />
                        <Label htmlFor={`viagem-size-${option.size}`} className="cursor-pointer text-xs sm:text-sm select-none">
                          {option.size}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center">
                  <span className="text-green-600 mr-2">•</span>
                  Inclui moldura premium
                </p>
                <p className="flex items-center">
                  <span className="text-green-600 mr-2">•</span>
                  Percurso 3D incluso
                </p>
                <p className="flex items-center">
                  <span className="text-green-600 mr-2">•</span>
                  Personalização completa (fotos + dados)
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                {currentSizeOption.isQuote ? (
                  <div className="text-2xl font-bold text-primary">
                    Solicitar orçamento
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground mb-1">
                      De <span className="line-through">R$ {fullPrice.toFixed(2).replace('.', ',')}</span> por:
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      R$ {finalPrice.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      5% de desconto no PIX ou parcele em até 12 vezes
                    </div>
                  </>
                )}
              </div>

              {currentSizeOption.isQuote ? (
                <Button 
                  onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de solicitar um orçamento para o quadro de viagem no tamanho ' + selectedSize, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
                >
                  Solicitar orçamento via WhatsApp
                </Button>
              ) : (
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-black hover:bg-black/90 text-white py-3 text-lg font-medium"
                >
                  Adicionar ao carrinho
                </Button>
              )}

              <div>
                <Label className="text-base font-medium mb-3 block">Consultar Frete</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Digite seu CEP (ex: 01310-100)"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="flex-1 min-h-[44px]"
                    maxLength={9}
                  />
                  <Button
                    onClick={handleCalculateFrete}
                    variant="outline"
                    className="px-6 min-h-[44px]"
                    disabled={isCalculatingShipping}
                  >
                    {isCalculatingShipping ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Calculando...
                      </>
                    ) : (
                      "Calcular"
                    )}
                  </Button>
                </div>

                {shippingError && (
                  <p className="text-red-600 text-sm mt-2">{shippingError}</p>
                )}

                {shippingOptions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Opções de envio:
                    </Label>
                    <div className="space-y-2">
                      {shippingOptions.slice(0, 3).map((option) => (
                        <Card key={option.id} className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              {option.company.picture && (
                                <img
                                  src={option.company.picture}
                                  alt={option.company.name}
                                  className="w-8 h-8 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{option.name}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {option.custom_delivery_time} dias úteis
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-green-600">
                                R$ {Number(option.custom_price).toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      * Prazo a partir da confirmação do pagamento
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSectionViagemLocal;
