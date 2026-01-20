import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Package, Clock, MapPin } from "lucide-react";
import { ShippingOption } from "@/types/shipping";

interface ShippingOptionsProps {
  options: ShippingOption[];
  selectedOption: ShippingOption | null;
  onSelect: (option: ShippingOption) => void;
  isLoading?: boolean;
  showPickup?: boolean;
}

const PICKUP_OPTION: ShippingOption = {
  id: -1,
  name: "Retirar no local",
  price: 0,
  custom_price: 0,
  currency: "R$",
  delivery_time: 0,
  custom_delivery_time: 0,
  delivery_range: { min: 0, max: 0 },
  company: {
    id: -1,
    name: "Loja Física",
    picture: ""
  },
  packages: []
};

export { PICKUP_OPTION };

export function ShippingOptions({
  options,
  selectedOption,
  onSelect,
  isLoading = false,
  showPickup = true
}: ShippingOptionsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Calculando opções de frete...</span>
      </div>
    );
  }

  if (!options || options.length === 0) {
    return null;
  }

  const allOptions = showPickup ? [PICKUP_OPTION, ...options] : options;

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold flex items-center gap-2">
        <Package className="w-4 h-4" />
        Escolha a forma de envio:
      </Label>

      <RadioGroup
        value={selectedOption?.id.toString()}
        onValueChange={(value) => {
          if (value === "-1") {
            onSelect(PICKUP_OPTION);
          } else {
            const option = options.find(o => o.id.toString() === value);
            if (option) onSelect(option);
          }
        }}
      >
        <div className="space-y-2">
          {allOptions.map((option) => {
            const isPickup = option.id === -1;
            const isSelected = selectedOption?.id === option.id;

            return (
              <Card
                key={option.id}
                className={`p-3 cursor-pointer transition-all hover:border-primary ${
                  isSelected ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => onSelect(option)}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value={option.id.toString()}
                    id={`shipping-option-${option.id}`}
                    className="shrink-0"
                  />

                  <div className="flex items-center justify-between w-full min-w-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {isPickup ? (
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-green-600" />
                        </div>
                      ) : option.company.picture ? (
                        <img
                          src={option.company.picture}
                          alt={option.company.name}
                          className="w-12 h-12 object-contain shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground text-sm">
                          {option.name}
                        </span>

                        {!isPickup && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>
                              {option.custom_delivery_time} dia{option.custom_delivery_time !== 1 ? 's' : ''} útei{option.custom_delivery_time !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <div className="font-bold text-foreground">
                        {!isPickup && (
                          `R$ ${Number(option.custom_price).toFixed(2).replace('.', ',')}`
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </RadioGroup>

      <p className="text-xs text-muted-foreground">
        * Prazo de entrega em dias úteis a partir da confirmação do envio
      </p>
    </div>
  );
}
