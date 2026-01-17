import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";

const ProductSectionCiclismoLocal = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState("preta-branca");
  const [selectedSize, setSelectedSize] = useState("33x33cm");
  const [cep, setCep] = useState("");

  // Save current store page for coupon validation
  useEffect(() => {
    localStorage.setItem('lastStorePage', 'ciclismo');
  }, []);

  // OPÇÕES ESPECÍFICAS DA LOJA CICLISMO
  const colorOptions = [
    { value: "preta-branca", label: "Preta/branca" }
  ];

  // PREÇOS ESPECÍFICOS DA LOJA CICLISMO
  const sizeOptions = [
    { size: "33x33cm", fullPrice: 353.90, pixPrice: 328.90 },
    { size: "33x43cm", fullPrice: 407.50, pixPrice: 382.50 },
    { size: "37x48cm", fullPrice: 448.30, pixPrice: 413.30 },
    { size: "43x53cm", fullPrice: 486.30, pixPrice: 451.30 },
    { size: "43x43cm", fullPrice: 1.00, pixPrice: 1.00 },
    { size: "53x53cm", fullPrice: 518.70, pixPrice: 483.70 }
  ];

  // IMAGENS ESPECÍFICAS DA LOJA CICLISMO
  const productImages = {
    caixaAlta30x30: "/images/ciclismo-30x30-caixa-alta.webp",
    caixaAlta33x43: "/images/ciclismo-33x43-caixa-alta.webp",
    caixaAlta37x48: "/images/ciclismo-37x48-caixa-alta.webp",
    caixaAlta40x40: "/images/ciclismo-40x40-caixa-alta.webp",
    caixaAlta40x50: "/images/ciclismo-40x50-caixa-alta.webp",
    caixaAlta40x60: "/images/ciclismo-40x60-caixa-alta.webp"
  };

  const getCurrentImage = () => {
    if (selectedSize === "33x33cm") {
      return productImages.caixaAlta30x30;
    }
    if (selectedSize === "33x43cm") {
      return productImages.caixaAlta33x43;
    }
    if (selectedSize === "37x48cm") {
      return productImages.caixaAlta37x48;
    }
    if (selectedSize === "43x43cm" || selectedSize === "53x53cm") {
      return productImages.caixaAlta40x40;
    }
    if (selectedSize === "43x53cm") {
      return productImages.caixaAlta40x50;
    }
    return productImages.caixaAlta30x30;
  };

  const productImage = getCurrentImage();

  const currentSizeOption = sizeOptions.find(option => option.size === selectedSize) || sizeOptions[0];
  const fullPrice = currentSizeOption.fullPrice;
  const finalPrice = currentSizeOption.pixPrice;
  const installmentPrice = (fullPrice / 12).toFixed(2);

  const handleAddToCart = () => {
    const productName = "Quadro Caixa Alta - Ciclismo";
    const colorDisplay = "Preta/Branca";
    
    addItem({
      nome: productName,
      cor: colorDisplay,
      tamanho: selectedSize,
      quantidade: 1,
      precoUnitario: finalPrice,
      imagem: productImage
    });

    toast({
      title: "Produto adicionado ao carrinho!",
      description: `${productName} ${selectedSize} ${colorDisplay}`
    });
  };

  const handleCalculateFrete = () => {
    // Freight calculation handled by CartContext
  };

  return (
    <section id="nossa-loja-ciclismo" data-section="nossa-loja-ciclismo" className="pt-2 md:pt-16 pb-12 sm:pb-16 bg-background product-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">NOSSA LOJA</h2>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            <div className="space-y-6 sm:space-y-8">
              <div className="relative">
                <img 
                  src={productImage} 
                  alt="Quadro personalizado de ciclismo" 
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
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Quadro Caixa Alta
                </h2>
                <p className="text-blue-600 font-medium text-sm sm:text-base">
                  COM percurso em alto relevo (3D)
                </p>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Cor da Moldura</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                  <div className="flex gap-3">
                    {colorOptions.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`ciclismo-color-${option.value}`} />
                        <Label htmlFor={`ciclismo-color-${option.value}`} className="cursor-pointer">
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
                    {sizeOptions.map(option => (
                      <div key={option.size} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.size} id={`ciclismo-size-${option.size}`} />
                        <Label htmlFor={`ciclismo-size-${option.size}`} className="cursor-pointer text-sm">
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
                    onChange={e => setCep(e.target.value)} 
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

export default ProductSectionCiclismoLocal;
