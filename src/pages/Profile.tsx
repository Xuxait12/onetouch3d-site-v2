import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import GlobalHeader from '@/components/GlobalHeader';
import { profileSchema, getValidationErrors } from "@/lib/validation";
import { z } from "zod";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [personType, setPersonType] = useState<'fisica' | 'juridica'>('fisica');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profile) {
        setFullName(profile.full_name || '');
        setPersonType(profile.person_type || 'fisica');
        setCpfCnpj(profile.cpf_cnpj || '');
        setBirthDate(profile.birth_date || '');
        setCountry(profile.country || 'Brasil');
        setCep(profile.cep || '');
        setAddress(profile.address || '');
        setNumber(profile.number || '');
        setComplement(profile.complement || '');
        setNeighborhood(profile.neighborhood || '');
        setCity(profile.city || '');
        setState(profile.state || '');
        setPhone(profile.phone || '');
      }
    };

    getProfile();
  }, [navigate]);

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (personType === 'fisica') {
      // CPF: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    if (!fullName || !cpfCnpj || !birthDate || !cep || !address || !number || !neighborhood || !city || !state || !phone) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Validate profile data with zod schema
      const profileData = {
        full_name: fullName.substring(0, 100),
        cpf_cnpj: cpfCnpj.substring(0, 18),
        birth_date: birthDate,
        cep: cep.substring(0, 10),
        address: address.substring(0, 200),
        number: number.substring(0, 20),
        complement: complement?.substring(0, 100) || null,
        neighborhood: neighborhood.substring(0, 100),
        city: city.substring(0, 100),
        state: state.substring(0, 50),
        phone: phone.substring(0, 20),
        email: user.email || '',
        person_type: personType,
        country: country.substring(0, 100),
      };

      try {
        profileSchema.parse(profileData);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const errors = getValidationErrors(validationError);
          toast({
            title: "Dados inválidos",
            description: errors[0] || "Verifique os campos informados.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        throw validationError;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          email: profileData.email,
          full_name: profileData.full_name,
          person_type: profileData.person_type,
          cpf_cnpj: profileData.cpf_cnpj,
          birth_date: profileData.birth_date,
          country: profileData.country,
          cep: profileData.cep,
          address: profileData.address,
          number: profileData.number,
          complement: profileData.complement,
          neighborhood: profileData.neighborhood,
          city: profileData.city,
          state: profileData.state,
          phone: profileData.phone,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Perfil atualizado!",
          description: "Suas informações foram salvas com sucesso.",
        });
        // Redirect to home after successful profile update
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <GlobalHeader />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personType">Tipo de Pessoa *</Label>
                  <Select value={personType} onValueChange={(value: 'fisica' | 'juridica') => setPersonType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisica">Pessoa Física</SelectItem>
                      <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">{personType === 'fisica' ? 'CPF' : 'CNPJ'} *</Label>
                  <Input
                    id="cpfCnpj"
                    type="text"
                    placeholder={personType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
                    maxLength={personType === 'fisica' ? 14 : 18}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    type="text"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => setCep(formatCep(e.target.value))}
                    maxLength={9}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Rua, Avenida, etc."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    type="text"
                    placeholder="123"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    type="text"
                    placeholder="Apto, Casa, etc."
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    type="text"
                    placeholder="Nome do bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Nome da cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="SP, RJ, MG, etc."
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    maxLength={15}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;