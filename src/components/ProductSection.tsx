import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ProductSection = () => {
  const [selectedType, setSelectedType] = useState("caixa-alta");
  const [selectedColor, setSelectedColor] = useState("preta-branca");
  const [selectedSize, setSelectedSize] = useState("33x33cm");
  const [cep, setCep] = useState("");

  const typeOptions = [
    { value: "caixa-alta", label: "Caixa Alta", price: 499 },
    { value: "caixa-baixa", label: "Caixa Baixa", price: 399 }
  ];

  const colorOptions = [
    { value: "preta-branca", label: "Preta/branca" },
    { value: "preta", label: "Preta" }
  ];

  const sizeOptions = [
    "33x33cm", "33x43cm", "37x48cm", "43x43cm", "43x53cm", "43x63cm", "53x53cm"
  ];

  const currentPrice = typeOptions.find(type => type.value === selectedType)?.price || 499;
  const installmentPrice = (currentPrice / 12).toFixed(2);

  const handleAddToCart = () => {
    const selectedProduct = {
      type: selectedType,
      color: selectedColor,
      size: selectedSize,
      price: currentPrice,
      title: selectedType === "caixa-alta" ? "Quadro Caixa Alta" : "Quadro Caixa Baixa"
    };
    
    console.log("Produto adicionado ao carrinho:", selectedProduct);
    // Aqui você pode implementar a lógica do carrinho
  };

  const handleCalculateFrete = () => {
    if (cep) {
      console.log("Calculando frete para CEP:", cep);
      // Implementar lógica de cálculo de frete
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Coluna Esquerda - Imagem e Características */}
          <div className="space-y-8">
            {/* Imagem do Produto */}
            <div className="relative">
              <img 
                src="/lovable-uploads/d23f9378-1b3e-4282-8d59-3641dc81b92f.png"
                alt="Quadro personalizado da corrida"
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Características da Moldura */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Características da Moldura</h3>
              <ul className="space-y-3 text-sm">
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
              <h2 className="text-2xl font-bold mb-2">
                {selectedType === "caixa-alta" ? "Quadro Caixa Alta" : "Quadro Caixa Baixa"}
              </h2>
              <p className="text-muted-foreground">
                {selectedType === "caixa-alta" ? "COM percurso em alto relevo (3D)" : "SEM alto relevo"}
              </p>
            </div>

            {/* Tipo de Moldura */}
            <div>
              <Label className="text-base font-medium mb-3 block">Tipo da Moldura</Label>
              <RadioGroup value={selectedType} onValueChange={setSelectedType}>
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
                <div className="grid grid-cols-3 gap-3">
                  {sizeOptions.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={size} />
                      <Label htmlFor={size} className="cursor-pointer text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Preço */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                R$ {currentPrice.toFixed(2).replace('.', ',')} no PIX
              </div>
              <div className="text-sm text-muted-foreground">
                ou até 12x de R$ {installmentPrice.replace('.', ',')} sem juros
              </div>
            </div>

            {/* Botão de Compra */}
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-black hover:bg-black/90 text-white py-3 text-lg font-medium"
            >
              Enviar ao Carrinho
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
    </section>
  );
};

export default ProductSection;