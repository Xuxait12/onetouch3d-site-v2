-- Corrigir função para definir search_path seguro
CREATE OR REPLACE FUNCTION public.send_order_confirmation_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  function_url TEXT;
BEGIN
  -- URL da edge function (será chamada via HTTP)
  function_url := 'https://wzjfofufvrtzhmkismyh.supabase.co/functions/v1/send-order-confirmation';
  
  -- Fazer chamada HTTP para a edge function
  PERFORM net.http_post(
    url := function_url,
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6amZvZnVmdnJ0emhta2lzbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDk2MjAsImV4cCI6MjA3MDc4NTYyMH0.0xT7PBdqMEHWo4h935Xe2CnCkIb3uE9MBRqdZGN9tsc"}'::jsonb,
    body := json_build_object('pedido_id', NEW.id)::text
  );
  
  RETURN NEW;
END;
$$;