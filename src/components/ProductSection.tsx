import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";

const ProductSection = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedType, setSelectedType] = useState("caixa-alta");
  const [selectedColor, setSelectedColor] = useState("preta-branca");
  const [selectedSize, setSelectedSize] = useState("33x33cm");

  // Reset color when type changes
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    // Reset color to first option of the new type
    if (value === "caixa-alta") {
      setSelectedColor("preta-branca");
    } else {
      setSelectedColor("branca");
    }
  };
  const [cep, setCep] = useState("");

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

  // Pricing tables for different frame types
  const sizeOptionsCaixaAlta = [
    { size: "33x33cm", fullPrice: 330, pixPrice: 309.50 },
    { size: "33x43cm", fullPrice: 359, pixPrice: 332.50 },
    { size: "37x48cm", fullPrice: 390, pixPrice: 363.00 },
    { size: "43x43cm", fullPrice: 385, pixPrice: 386.00 },
    { size: "43x53cm", fullPrice: 439, pixPrice: 414.50 },
    { size: "43x63cm", fullPrice: 560, pixPrice: 517.50 },
    { size: "53x53cm", fullPrice: 510, pixPrice: 493.50 }
  ];

  const sizeOptionsCaixaBaixa = [
    { size: "33x33cm", fullPrice: 310, finalPrice: 285.50 },
    { size: "33x43cm", fullPrice: 330, finalPrice: 305.50 },
    { size: "37x48cm", fullPrice: 360, finalPrice: 323.50 },
    { size: "43x43cm", fullPrice: 380, finalPrice: 329.50 },
    { size: "43x53cm", fullPrice: 410, finalPrice: 393.00 },
    { size: "43x63cm", fullPrice: 510, finalPrice: 485.50 },
    { size: "53x53cm", fullPrice: 490, finalPrice: 468.50 }
  ];

  const sizeOptions = selectedType === "caixa-alta" ? sizeOptionsCaixaAlta : sizeOptionsCaixaBaixa;
  const currentSizeOption = sizeOptions.find(option => option.size === selectedSize) || sizeOptions[0];
  
  // Calculate prices based on frame type
  const fullPrice = currentSizeOption.fullPrice;
  const finalPrice = selectedType === "caixa-alta" 
    ? (currentSizeOption as any).pixPrice 
    : (currentSizeOption as any).finalPrice;
  const installmentPrice = (fullPrice / 12).toFixed(2);

  const colorOptions = selectedType === "caixa-alta" ? colorOptionsCaixaAlta : colorOptionsCaixaBaixa;

  const handleAddToCart = () => {
    const productName = selectedType === "caixa-alta" ? "Quadro Caixa Alta" : "Quadro Caixa Baixa";
    const colorDisplay = selectedColor === "preta-branca" ? "Preta/Branca" : 
                        selectedColor === "preta" ? "Preta" : "Branca";
    
    const productImage = selectedType === "caixa-alta" 
      ? "/lovable-uploads/519a0914-d9b2-4031-8781-87e125ccc763.png" 
      : selectedType === "caixa-baixa" && selectedColor === "branca"
      ? "/lovable-uploads/9a113f39-ed59-40e5-97f4-b4589f60aa35.png"
      : "/lovable-uploads/5eab4c9e-14d7-460b-bc61-945f92a65e4e.png";
    
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

    // Stay on the same page, don't navigate to cart
  };

  const handleCalculateFrete = () => {
    if (cep) {
      console.log("Calculando frete para CEP:", cep);
      // Implementar lógica de cálculo de frete
    }
  };

  return (
    <section id="nossa-loja" data-section="nossa-loja" className="py-16 bg-background product-section">
      <div className="max-w-7xl mx-auto px-6">
        {/* Título da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground">NOSSA LOJA</h2>
        </div>
        
        {/* Container Principal */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Coluna Esquerda - Imagem e Características */}
          <div className="space-y-8">
            {/* Imagem do Produto */}
            <div className="relative">
              <img 
                src={
                  selectedType === "caixa-alta" 
                    ? "/lovable-uploads/519a0914-d9b2-4031-8781-87e125ccc763.png" 
                    : selectedType === "caixa-baixa" && selectedColor === "branca"
                    ? "/lovable-uploads/9a113f39-ed59-40e5-97f4-b4589f60aa35.png"
                    : "/lovable-uploads/5eab4c9e-14d7-460b-bc61-945f92a65e4e.png"
                }
                alt="Quadro personalizado da corrida"
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Características da Moldura */}
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
                      <span><strong>Acabamento sofisticado:</strong> Madeira com revestimento PET texturizado em preto e interno liso branco.</span>
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
                      <span><strong>Design moderno:</strong> Moldura preta premium ou moldura branca premium.</span>
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
                )}
              </ul>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-600 font-semibold text-center">
                  NÃO NECESSITA ENVIO DA MEDALHA
                </p>
              </div>
            </Card>
          </div>

          {/* Coluna Direita - Seleções e Compra */}
          <div className="space-y-6">
            {/* Título do Produto */}
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {selectedType === "caixa-alta" ? "Quadro Caixa Alta" : "Quadro Caixa Baixa"}
              </h2>
              <p className="text-blue-600 font-medium">
                {selectedType === "caixa-alta" ? "COM percurso em alto relevo (3D)" : "SEM alto relevo"}
              </p>
            </div>

            {/* Tipo de Moldura */}
            <div>
              <Label className="text-base font-medium mb-3 block">Tipo da Moldura</Label>
              <RadioGroup value={selectedType} onValueChange={handleTypeChange}>
                <div className="flex gap-3">
                  {typeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Cor da Moldura */}
            <div>
              <Label className="text-base font-medium mb-3 block">Cor da Moldura</Label>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                <div className="flex gap-3">
                  {colorOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Tamanho */}
            <div>
              <Label className="text-base font-medium mb-3 block">Tamanho</Label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="grid grid-cols-2 gap-3">
                  {sizeOptions.map((option) => (
                    <div key={option.size} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.size} id={option.size} />
                      <Label htmlFor={option.size} className="cursor-pointer text-sm">
                        {option.size}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Bullet points */}
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

            {/* Preço */}
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

            {/* Botão de Compra */}
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-black hover:bg-black/90 text-white py-3 text-lg font-medium"
            >
              Garanta já seu quadro personalizado
            </Button>

            {/* Consulta de Frete */}
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

export default ProductSection;