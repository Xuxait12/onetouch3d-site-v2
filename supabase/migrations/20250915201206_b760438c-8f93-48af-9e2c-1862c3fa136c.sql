-- Create policy for admin to view all orders
CREATE POLICY "Admin can view all orders" 
ON public.pedidos 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'onetouch3dbrasil@gmail.com'
  )
);

-- Create policy for admin to view all profiles
CREATE POLICY "Admin can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'onetouch3dbrasil@gmail.com'
  )
);