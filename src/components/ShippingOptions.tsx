import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Package, Clock } from "lucide-react";
import { ShippingOption } from "@/types/shipping";

interface ShippingOptionsProps {
  options: ShippingOption[];
  selectedOption: ShippingOption | null;
  onSelect: (option: ShippingOption) => void;
  isLoading?: boolean;
}

export function ShippingOptions({
  options,
  selectedOption,
  onSelect,
  isLoading = false
}: ShippingOptionsProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Calculando opções de frete...</span>
        </div>
      </Card>
    );
  }

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold flex items-center gap-2">
        <Package className="w-4 h-4" />
        Escolha a forma de envio:
      </Label>

      <RadioGroup
        value={selectedOption?.id.toString()}
        onValueChange={(value) => {
          const option = options.find(o => o.id.toString() === value);
          if (option) onSelect(option);
        }}
      >
        <div className="space-y-2">
          {options.map((option) => (
            <Card
              key={option.id}
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                selectedOption?.id === option.id ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onSelect(option)}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`shipping-option-${option.id}`}
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      {option.company.picture && (
                        <img
                          src={option.company.picture}
                          alt={option.company.name}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {option.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            - {option.company.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            {option.custom_delivery_time} dia
                            {option.custom_delivery_time !== 1 ? 's' : ''} útei
                            {option.custom_delivery_time !== 1 ? 's' : ''}
                          </span>
                          {option.delivery_range && (
                            <span className="text-xs">
                              ({option.delivery_range.min}-{option.delivery_range.max} dias)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg text-green-600">
                        R$ {Number(option.custom_price).toFixed(2).replace('.', ',')}
                      </div>
                      {option.discount && option.discount !== "0%" && (
                        <div className="text-xs text-muted-foreground">
                          {option.discount} de desconto
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </RadioGroup>

      {options.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          * Prazo de entrega em dias úteis a partir da confirmação do pagamento
        </p>
      )}
    </div>
  );
}
