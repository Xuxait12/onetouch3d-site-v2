import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";

const ProductSectionTriathlonLocal = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedType, setSelectedType] = useState("caixa-alta");
  const [selectedColor, setSelectedColor] = useState("preta-branca");
  const [selectedSize, setSelectedSize] = useState("33x43cm");
  const [cep, setCep] = useState("");

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    if (value === "caixa-alta") {
      setSelectedColor("preta-branca");
    } else {
      setSelectedColor("preta");
    }
  };

  const typeOptions = [
    { value: "caixa-alta", label: "Caixa Alta" },
    { value: "caixa-baixa", label: "Caixa Baixa" }
  ];

  const colorOptionsCaixaAlta = [
    { value: "preta-branca", label: "Preta/branca" }
  ];

  const colorOptionsCaixaBaixa = [
    { value: "preta", label: "Preta" }
  ];

  // TAMANHOS E PREÇOS ESPECÍFICOS DA LOJA TRIATHLON
  const sizeOptionsCaixaAlta = [
    { size: "33x43cm", fullPrice: 359, pixPrice: 332.50 },
    { size: "37x48cm", fullPrice: 390, pixPrice: 363.00 },
    { size: "43x53cm", fullPrice: 439, pixPrice: 414.50 },
    { size: "43x63cm", fullPrice: 560, pixPrice: 517.50 },
    { size: "53x73cm", fullPrice: 650, pixPrice: 600.00 }
  ];

  const sizeOptionsCaixaBaixa = [
    { size: "33x43cm", fullPrice: 330, finalPrice: 305.50 },
    { size: "37x48cm", fullPrice: 360, finalPrice: 323.50 },
    { size: "43x53cm", fullPrice: 410, finalPrice: 393.00 },
    { size: "43x63cm", fullPrice: 510, finalPrice: 485.50 },
    { size: "53x73cm", fullPrice: 620, finalPrice: 575.00 }
  ];

  // IMAGENS ESPECÍFICAS DA LOJA TRIATHLON
  const productImages = {
    caixaAlta: "/lovable-uploads/519a0914-d9b2-4031-8781-87e125ccc763.png",
    caixaBaixa: "/lovable-uploads/5eab4c9e-14d7-460b-bc61-945f92a65e4e.png"
  };

  const sizeOptions = selectedType === "caixa-alta" ? sizeOptionsCaixaAlta : sizeOptionsCaixaBaixa;
  const currentSizeOption = sizeOptions.find(option => option.size === selectedSize) || sizeOptions[0];
  
  const fullPrice = currentSizeOption.fullPrice;
  const finalPrice = selectedType === "caixa-alta" 
    ? (currentSizeOption as any).pixPrice 
    : (currentSizeOption as any).finalPrice;
  const installmentPrice = (fullPrice / 12).toFixed(2);

  const colorOptions = selectedType === "caixa-alta" ? colorOptionsCaixaAlta : colorOptionsCaixaBaixa;

  const getCurrentImage = () => {
    return selectedType === "caixa-alta" ? productImages.caixaAlta : productImages.caixaBaixa;
  };

  const handleAddToCart = () => {
    const productName = selectedType === "caixa-alta" ? "Quadro Caixa Alta - Triathlon" : "Quadro Caixa Baixa - Triathlon";
    const colorDisplay = selectedColor === "preta-branca" ? "Preta/Branca" : "Preta";
    
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

  const handleCalculateFrete = () => {
    if (cep) {
      console.log("Calculando frete para CEP:", cep);
    }
  };

  return (
    <section id="nossa-loja" data-section="nossa-loja" className="pb-16 product-section" style={{ background: 'transparent !important' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-2xl shadow-lg p-8" style={{ background: 'transparent !important' }}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground">NOSSA LOJA</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="relative">
                <img 
                  src={getCurrentImage()}
                  alt="Quadro personalizado de triathlon"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {selectedType === "caixa-alta" ? "Características da Moldura Caixa Alta" : "Características da Moldura"}
                </h3>
                <ul className="space-y-3 text-sm">
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
                  ) : (
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
                  )}
                </ul>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-600 font-semibold text-center">
                    NÃO NECESSITA ENVIO DA MEDALHA
                  </p>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {selectedType === "caixa-alta" ? "Quadro Caixa Alta" : "Quadro Caixa Baixa"}
                </h2>
                <p className="text-blue-600 font-medium">
                  {selectedType === "caixa-alta" ? "COM percurso em alto relevo (3D)" : "SEM percurso em alto relevo (3D)"}
                </p>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Tipo da Moldura</Label>
                <RadioGroup value={selectedType} onValueChange={handleTypeChange}>
                  <div className="flex gap-3">
                    {typeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`triathlon-type-${option.value}`} />
                        <Label htmlFor={`triathlon-type-${option.value}`} className="cursor-pointer">
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
                        <RadioGroupItem value={option.value} id={`triathlon-color-${option.value}`} />
                        <Label htmlFor={`triathlon-color-${option.value}`} className="cursor-pointer">
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
                  <div className="grid grid-cols-2 gap-3">
                    {sizeOptions.map((option) => (
                      <div key={option.size} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.size} id={`triathlon-size-${option.size}`} />
                        <Label htmlFor={`triathlon-size-${option.size}`} className="cursor-pointer text-sm">
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
                <div className="text-sm text-muted-foreground mb-1">
                  De <span className="line-through">R$ {fullPrice.toFixed(2).replace('.', ',')}</span> por:
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  R$ {finalPrice.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-sm text-muted-foreground">
                  5% de desconto no PIX ou parcele em até 12 vezes
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="w-full bg-black hover:bg-black/90 text-white py-3 text-lg font-medium"
              >
                Adicionar ao carrinho
              </Button>

              <div>
                <Label className="text-base font-medium mb-3 block">Consultar Frete</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Digite seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleCalculateFrete}
                    variant="outline"
                    className="px-6"
                  >
                    Calcular
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSectionTriathlonLocal;
