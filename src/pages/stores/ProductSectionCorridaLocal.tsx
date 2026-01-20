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

const ProductSectionCorridaLocal = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedType, setSelectedType] = useState("caixa-alta");
  const [selectedColor, setSelectedColor] = useState("preta-branca");
  const [selectedSize, setSelectedSize] = useState("33x33cm");

  // Save current store page for coupon validation
  useEffect(() => {
    localStorage.setItem('lastStorePage', 'corrida');
  }, []);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    if (value === "caixa-alta") {
      setSelectedColor("preta-branca");
    } else {
      setSelectedColor("branca");
    }
  };
  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  const typeOptions = [
    { value: "caixa-alta", label: "Caixa Alta" },
    { value: "caixa-baixa", label: "Caixa Baixa" }
  ];

  const colorOptionsCaixaAlta = [
    { value: "preta-branca", label: "Preta/branca" }
  ];

  const colorOptionsCaixaBaixa = [
    { value: "branca", label: "Branca" },
    { value: "preta", label: "Preta" }
  ];

  const sizeOptionsCaixaAlta = [
    { size: "33x33cm", fullPrice: 350.50, pixPrice: 325.50 },
    { size: "33x43cm", fullPrice: 371.50, pixPrice: 346.50 },
    { size: "37x48cm", fullPrice: 413.00, pixPrice: 378.00 },
    { size: "43x43cm", fullPrice: 416.00, pixPrice: 381.00 },
    { size: "43x53cm", fullPrice: 465.50, pixPrice: 430.50 },
    { size: "43x63cm", fullPrice: 570.50, pixPrice: 535.50 },
    { size: "53x53cm", fullPrice: 549.50, pixPrice: 514.50 },
    { size: "53x73cm", fullPrice: 612.50, pixPrice: 577.50 }
  ];

  const sizeOptionsCaixaBaixa = [
    { size: "33x33cm", fullPrice: 316.90, finalPrice: 291.90 },
    { size: "33x43cm", fullPrice: 334.70, finalPrice: 309.70 },
    { size: "37x48cm", fullPrice: 381.50, finalPrice: 346.50 },
    { size: "43x43cm", fullPrice: 383.90, finalPrice: 348.90 },
    { size: "43x53cm", fullPrice: 434.00, finalPrice: 399.00 },
    { size: "43x63cm", fullPrice: 539.00, finalPrice: 504.00 },
    { size: "53x53cm", fullPrice: 518.00, finalPrice: 483.00 },
    { size: "53x73cm", fullPrice: 581.00, finalPrice: 546.00 }
  ];

  const sizeOptions = selectedType === "caixa-alta" ? sizeOptionsCaixaAlta : sizeOptionsCaixaBaixa;
  const currentSizeOption = sizeOptions.find(option => option.size === selectedSize) || sizeOptions[0];
  
  const fullPrice = currentSizeOption.fullPrice;
  const finalPrice = selectedType === "caixa-alta" 
    ? (currentSizeOption as any).pixPrice 
    : (currentSizeOption as any).finalPrice;
  const installmentPrice = (fullPrice / 12).toFixed(2);

  const colorOptions = selectedType === "caixa-alta" ? colorOptionsCaixaAlta : colorOptionsCaixaBaixa;

  // IMAGENS ESPECÍFICAS DA LOJA CORRIDA
  const productImages = {
    caixaAlta30x30: "/images/corrida-30x30-caixa-alta.webp",
    caixaAlta33x43: "/images/corrida-33x43-caixa-alta.webp",
    caixaAlta37x48: "/images/corrida-37x48-caixa-alta.webp",
    caixaAlta43x43: "/images/corrida-43x43-caixa-alta.webp",
    caixaAlta43x53: "/images/corrida-43x53-caixa-alta.webp",
    caixaAlta53x53: "/images/corrida-53x53-caixa-alta.webp",
    caixaAlta53x73: "/images/corrida-53x73-caixa-alta.webp",
    caixaBaixaBranca: "/lovable-uploads/9a113f39-ed59-40e5-97f4-b4589f60aa35.png",
    caixaBaixaBranca33x43: "/images/corrida-33x43-caixa-baixa-branca.webp",
    caixaBaixaPreta: "/lovable-uploads/5eab4c9e-14d7-460b-bc61-945f92a65e4e.png"
  };

  const getCurrentImage = () => {
    if (selectedType === "caixa-alta") {
      // Cada tamanho usa sua imagem específica
      if (selectedSize === "33x33cm") {
        return productImages.caixaAlta30x30;
      }
      if (selectedSize === "33x43cm" || selectedSize === "43x63cm") {
        return productImages.caixaAlta33x43;
      }
      if (selectedSize === "37x48cm") {
        return productImages.caixaAlta37x48;
      }
      if (selectedSize === "43x43cm") {
        return productImages.caixaAlta43x43;
      }
      if (selectedSize === "43x53cm") {
        return productImages.caixaAlta43x53;
      }
      if (selectedSize === "53x53cm") {
        return productImages.caixaAlta53x53;
      }
      if (selectedSize === "53x73cm") {
        return productImages.caixaAlta53x73;
      }
      // Padrão
      return productImages.caixaAlta30x30;
    }
    // Caixa baixa branca 33x43cm usa imagem específica
    if (selectedColor === "branca" && selectedSize === "33x43cm") {
      return productImages.caixaBaixaBranca33x43;
    }
    return selectedColor === "branca" ? productImages.caixaBaixaBranca : productImages.caixaBaixaPreta;
  };

  const handleAddToCart = () => {
    const productName = selectedType === "caixa-alta" ? "Quadro Caixa Alta - Corrida" : "Quadro Caixa Baixa - Corrida";
    const colorDisplay = selectedColor === "preta-branca" ? "Preta/Branca" : 
                        selectedColor === "preta" ? "Preta" : "Branca";
    
    addItem({
      nome: productName,
      cor: colorDisplay,
      tamanho: selectedSize,
      quantidade: 1,
      precoUnitario: finalPrice,
      imagem: getCurrentImage(),
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
      const productPrice = selectedType === "caixa-alta"
        ? (currentSizeOption as any).pixPrice
        : (currentSizeOption as any).finalPrice;

      const { data, error } = await supabase.functions.invoke('calculate-shipping', {
        body: {
          cep_destino: cepLimpo,
          items: [{
            tamanho: selectedSize,
            quantidade: 1,
            subtotal: productPrice
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
                  src={getCurrentImage()}
                  alt="Quadro personalizado da corrida"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <Card className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  {selectedType === "caixa-alta" ? "Características da Moldura Caixa Alta" : "Características da Moldura"}
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm">
                  {selectedType === "caixa-alta" && selectedColor === "preta-branca" ? (
                    <>
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
                    </>
                  ) : selectedType === "caixa-alta" && selectedColor === "preta" ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Acabamento sofisticado:</strong> Madeira com revestimento PET texturizado em preto e interno EVA preto.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Dimensões:</strong> Espessura 5,2cm (distância da parede) e largura 3,1cm (frontal).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Materiais de qualidade:</strong> Madeira + EVA + fundo em MDF 3mm.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Design moderno:</strong> Combinação preta externa e interna.</span>
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
                    </>
                  ) : selectedColor === "preta" ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Acabamento sofisticado:</strong> Madeira com revestimento PET texturizado em preto.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Dimensões:</strong> Espessura 3,2cm (distância da parede) e largura 2cm (frontal).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Materiais de qualidade:</strong> Madeira + fundo em MDF 3mm.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Design moderno:</strong> Moldura preta premium.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Proteção:</strong> Vidro 3mm no tamanho da imagem.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Envio seguro:</strong> Embalagem reforçada com papelão e isopor.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Kit instalação:</strong> Pendurador, parafuso, bucha e fita 3M.</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Acabamento sofisticado:</strong> Madeira com revestimento PET branco liso.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Dimensões:</strong> Espessura 3,2cm (distância da parede) e largura 2cm (frontal).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Materiais de qualidade:</strong> Madeira + fundo em MDF 3mm.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Design moderno:</strong> Moldura branca premium.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Proteção:</strong> Vidro 3mm no tamanho da imagem.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Envio seguro:</strong> Embalagem reforçada com papelão e isopor.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Kit instalação:</strong> Pendurador, parafuso, bucha e fita 3M.</span>
                      </li>
                    </>
                  )}
                </ul>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-600 font-semibold text-center">
                    NÃO NECESSITA ENVIO DA MEDALHA
                  </p>
                </div>
              </Card>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  {selectedType === "caixa-alta" ? "Quadro Caixa Alta" : "Quadro Caixa Baixa"}
                </h2>
                <p className="text-blue-600 font-medium text-sm sm:text-base">
                  {selectedType === "caixa-alta" ? "COM percurso em alto relevo (3D)" : "SEM percurso em alto relevo (3D)"}
                </p>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Tipo da Moldura</Label>
                <RadioGroup value={selectedType} onValueChange={handleTypeChange}>
                  <div className="flex gap-3">
                    {typeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`corrida-type-${option.value}`} />
                        <Label htmlFor={`corrida-type-${option.value}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Cor da Moldura</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                  <div className="flex gap-3">
                    {colorOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`corrida-color-${option.value}`} />
                        <Label htmlFor={`corrida-color-${option.value}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm sm:text-base font-medium mb-3 block">Tamanho</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {sizeOptions.map((option) => (
                      <div key={option.size} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.size} id={`corrida-size-${option.size}`} />
                        <Label htmlFor={`corrida-size-${option.size}`} className="cursor-pointer text-xs sm:text-sm">
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
                  {selectedType === "caixa-baixa" ? "SEM percurso 3D incluso" : "Percurso 3D incluso"}
                </p>
                <p className="flex items-center">
                  <span className="text-green-600 mr-2">•</span>
                  Personalização completa (fotos + dados)
                </p>
              </div>

              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                  De <span className="line-through">R$ {fullPrice.toFixed(2).replace('.', ',')}</span> por:
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                  R$ {finalPrice.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  5% de desconto no PIX ou parcele em até 12 vezes
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="w-full bg-black hover:bg-black/90 text-white py-3 text-base sm:text-lg font-medium min-h-[48px]"
              >
                Adicionar ao carrinho
              </Button>

              <div>
                <Label className="text-sm sm:text-base font-medium mb-3 block">Consultar Frete</Label>
                <div className="flex flex-col sm:flex-row gap-2">
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

export default ProductSectionCorridaLocal;
