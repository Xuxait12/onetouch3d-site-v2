-- Fix security warning: Set search_path for the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert basic profile data when user signs up
  INSERT INTO public.profiles (user_id, full_name, email, cpf_cnpj, birth_date, cep, address, number, neighborhood, city, state, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    '',  -- Will be filled by user in profile page
    '1990-01-01',  -- Default date, will be updated by user
    '',  -- Will be filled by user
    '',  -- Will be filled by user
    '',  -- Will be filled by user
    '',  -- Will be filled by user
    '',  -- Will be filled by user
    '',  -- Will be filled by user
    ''   -- Will be filled by user
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;