-- First, let's drop the existing problematic policies if they exist
DROP POLICY IF EXISTS "Admin can view all orders" ON public.pedidos;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.pedidos;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Add is_admin column to profiles table (if it doesn't exist)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Update the admin user to have is_admin = true
UPDATE public.profiles 
SET is_admin = true 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'onetouch3dbrasil@gmail.com'
);

-- Create a security definer function to check if current user is admin
-- This prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE user_id = auth.uid()),
    false
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create proper admin policies using the security definer function
CREATE POLICY "Admins can view all orders"
ON public.pedidos
FOR SELECT
USING (public.is_current_user_admin() = true);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_current_user_admin() = true);