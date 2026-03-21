

## Plan: Add order number display and confirmation modal

### Changes in `src/pages/ConfirmacaoWhatsapp.tsx`

**1. Add state** (after line 74):
- `const [numeroPedido, setNumeroPedido] = useState<number | null>(null);`
- `const [showPedidoConfirmado, setShowPedidoConfirmado] = useState(false);`

**2. Capture `numero` from insert** (lines 434-444):
Replace the insert to `vendas_manuais` to use `.select('numero').single()` and store the returned number:
```typescript
const { data: vendaData, error: vendaError } = await supabase
  .from('vendas_manuais')
  .insert({ ... })
  .select('numero')
  .single();

if (vendaData?.numero) setNumeroPedido(vendaData.numero);
```

**3. Success modal close → confirmation modal** (line 711):
Change `onOpenChange` so closing the QR code modal opens the confirmation modal:
```typescript
onOpenChange={(open) => {
  if (!open) {
    setShowSuccessModal(false);
    setShowPedidoConfirmado(true);
  }
}}
```

**4. Add new "Pedido Confirmado" modal** (after `renderSuccessModal`, before the return):
A new `renderPedidoConfirmadoModal` function with a Dialog showing:
- Title: "Pedido Confirmado!"
- Text: "Seu pedido #[numeroPedido] foi registrado com sucesso. Assim que o pagamento PIX for identificado, você receberá a confirmação."
- Button: "Voltar para o início" → navigates to `/`

**5. Render the new modal** (line 759):
Add `{renderPedidoConfirmadoModal()}` alongside the other modals. Import `useNavigate` from react-router-dom.

