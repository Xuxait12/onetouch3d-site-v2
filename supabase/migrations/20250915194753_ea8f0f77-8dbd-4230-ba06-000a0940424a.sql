-- Add shipping_address field to pedidos table
ALTER TABLE public.pedidos 
ADD COLUMN shipping_address TEXT;