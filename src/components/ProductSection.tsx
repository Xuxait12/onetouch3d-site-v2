
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const ProductSection = () => {
  const [selectedColor, setSelectedColor] = useState("Preta");
  const [selectedType, setSelectedType] = useState("Caixa Alta");
  const [selectedSize, setSelectedSize] = useState("30x40cm");
  const [cep, setCep] = useState("");

  const colorOptions = ["Preta", "Branca"];
  const typeOptions = ["Caixa Alta", "Caixa Baixa"];
  const sizeOptions = [
    "20x30cm",
    "30x40cm", 
    "40x50cm",
    "50x70cm",
    "60x80cm",
    "70x100cm"
  ];

  const pixPrice = 499.00;
  const installmentPrice = 49.90;
  const installments = 12;

  return (
    <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-text mb-4">Produto em Destaque</h2>
          <p className="body-large text-muted-foreground">
            Descubra nossa criação mais especial
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Área da Imagem e Descrição do Produto */}
              <div className="relative overflow-hidden">
                {/* Imagem do Produto */}
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group cursor-pointer">
                  <img 
                    src="/lovable-uploads/433fbef2-a13f-4b22-8332-3e1083bb0e7e.png"
                    alt="Quadro Caixa Alta"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
                
                {/* Área de Descrição do Produto */}
                <div className="p-6 bg-white border-t border-gray-100">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">Características da Moldura</h4>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        <p><strong>Acabamento sofisticado:</strong> Madeira com revestimento PET texturizado em preto e interno liso branco.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        <p><strong>Dimensões:</strong> Espessura 5,2cm (distância da parede) e largura 3,1cm (frontal).</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        <p><strong>Materiais de qualidade:</strong> Madeira + fundo em MDF 3mm.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        <p><strong>Design moderno:</strong> Combinação preta externa e branca interna.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        <p><strong>Proteção:</strong> Vidro 3mm no tamanho da moldura.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        <p><strong>Envio seguro:</strong> Embalagem reforçada com papelão e isopor.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        <p><strong>Kit instalação:</strong> Pendurador, parafuso, bucha e fita 3M.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Produto */}
              <div className="p-8 lg:p-12 space-y-8">
                {/* Título */}
                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-2">
                    Quadro Caixa Alta
                  </h3>
                  <p className="text-muted-foreground">
                    Design premium com tecnologia de impressão 3D
                  </p>
                </div>

                {/* Seleção de Cor */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">Cor da Moldura</Label>
                  <div className="flex gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                          selectedColor === color
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 bg-background"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seleção de Tipo */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">Tipo da Moldura</Label>
                  <div className="flex gap-3">
                    {typeOptions.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                          selectedType === type
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 bg-background"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seleção de Tamanho */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">Tamanho</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 text-sm rounded-lg border-2 transition-all duration-200 ${
                          selectedSize === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 bg-background"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preços */}
                <div className="space-y-4 py-4 border-t border-border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {pixPrice.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        no PIX
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ou até {installments}x de R$ {installmentPrice.toFixed(2).replace('.', ',')} sem juros
                    </p>
                  </div>
                </div>

                {/* Botão CTA */}
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Comprar Agora
                </Button>

                {/* Consultar CEP */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <Label className="text-sm font-semibold text-foreground">Consultar Frete</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Digite seu CEP"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="flex-1 rounded-lg"
                      maxLength={9}
                    />
                    <Button 
                      variant="outline" 
                      className="px-6 rounded-lg border-border hover:border-primary"
                    >
                      Calcular
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProductSection;
