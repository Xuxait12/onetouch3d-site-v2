import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Phone, MapPin, Calendar, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

interface ProfileData {
  full_name: string;
  person_type: "fisica" | "juridica";
  cpf_cnpj: string;
  birth_date: string;
  country: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: "",
    person_type: "fisica",
    cpf_cnpj: "",
    birth_date: "",
    country: "Brasil",
    cep: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    phone: "",
    email: user?.email || ""
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setProfileData({
          full_name: data.full_name || "",
          person_type: data.person_type || "fisica",
          cpf_cnpj: data.cpf_cnpj || "",
          birth_date: data.birth_date || "",
          country: data.country || "Brasil",
          cep: data.cep || "",
          address: data.address || "",
          number: data.number || "",
          complement: data.complement || "",
          neighborhood: data.neighborhood || "",
          city: data.city || "",
          state: data.state || "",
          phone: data.phone || "",
          email: data.email || user.email || ""
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    
    if (profileData.person_type === "fisica") {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const validateForm = () => {
    const requiredFields = [
      "full_name", "cpf_cnpj", "birth_date", "cep", 
      "address", "number", "neighborhood", "city", "state", "phone"
    ];

    for (const field of requiredFields) {
      if (!profileData[field as keyof ProfileData]) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate CPF/CNPJ length
    const numbers = profileData.cpf_cnpj.replace(/\D/g, "");
    if (profileData.person_type === "fisica" && numbers.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "O CPF deve ter 11 dígitos.",
        variant: "destructive",
      });
      return false;
    }
    
    if (profileData.person_type === "juridica" && numbers.length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "O CNPJ deve ter 14 dígitos.",
        variant: "destructive",
      });
      return false;
    }

    // Validate CEP
    const cepNumbers = profileData.cep.replace(/\D/g, "");
    if (cepNumbers.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "O CEP deve ter 8 dígitos.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) return;

    setLoading(true);

    try {
      const dataToSave = {
        user_id: user.id,
        ...profileData,
        cpf_cnpj: profileData.cpf_cnpj.replace(/\D/g, ""),
        cep: profileData.cep.replace(/\D/g, ""),
        phone: profileData.phone.replace(/\D/g, "")
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(dataToSave, { 
          onConflict: "user_id"
        });

      if (error) throw error;

      toast({
        title: "Perfil salvo!",
        description: "Suas informações foram atualizadas com sucesso.",
      });

    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <GlobalHeader />
      
      <main className="container mx-auto px-6 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Meu Perfil
            </CardTitle>
            <CardDescription>
              Preencha suas informações pessoais para completar seu cadastro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={profileData.full_name}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="person_type">Tipo de Pessoa *</Label>
                  <Select 
                    value={profileData.person_type} 
                    onValueChange={(value) => handleSelectChange("person_type", value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisica">Pessoa Física</SelectItem>
                      <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf_cnpj">
                    {profileData.person_type === "fisica" ? "CPF" : "CNPJ"} *
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cpf_cnpj"
                      name="cpf_cnpj"
                      value={formatCpfCnpj(profileData.cpf_cnpj)}
                      onChange={(e) => handleInputChange({
                        ...e,
                        target: { ...e.target, value: e.target.value.replace(/\D/g, "") }
                      })}
                      placeholder={profileData.person_type === "fisica" ? "000.000.000-00" : "00.000.000/0000-00"}
                      className="pl-9"
                      required
                      disabled={loading}
                      maxLength={profileData.person_type === "fisica" ? 14 : 18}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="birth_date"
                      name="birth_date"
                      type="date"
                      value={profileData.birth_date}
                      onChange={handleInputChange}
                      className="pl-9"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    required
                    disabled={true} // Email should not be editable
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formatPhone(profileData.phone)}
                      onChange={(e) => handleInputChange({
                        ...e,
                        target: { ...e.target, value: e.target.value.replace(/\D/g, "") }
                      })}
                      placeholder="(11) 99999-9999"
                      className="pl-9"
                      required
                      disabled={loading}
                      maxLength={15}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      name="cep"
                      value={formatCep(profileData.cep)}
                      onChange={(e) => handleInputChange({
                        ...e,
                        target: { ...e.target, value: e.target.value.replace(/\D/g, "") }
                      })}
                      placeholder="00000-000"
                      required
                      disabled={loading}
                      maxLength={9}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      placeholder="Rua, avenida, etc."
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      id="number"
                      name="number"
                      value={profileData.number}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      name="complement"
                      value={profileData.complement}
                      onChange={handleInputChange}
                      placeholder="Apto, bloco, etc. (opcional)"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      value={profileData.neighborhood}
                      onChange={handleInputChange}
                      placeholder="Seu bairro"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={profileData.city}
                      onChange={handleInputChange}
                      placeholder="Sua cidade"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={profileData.state}
                      onChange={handleInputChange}
                      placeholder="Seu estado"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      name="country"
                      value={profileData.country}
                      onChange={handleInputChange}
                      placeholder="Brasil"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Perfil"
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/home")}
                  disabled={loading}
                >
                  Voltar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Profile;