// Imóveis e empreendimentos de exemplo usados no painel admin.
// Provisório: na etapa do banco de dados, essas listas vêm de lá.
// corretorId = corretor responsável (ver lib/mock/corretores.ts).

export const imoveisMock = [
  { id: 1, nome: "Apartamento Jardins", sub: "São Paulo · 98m² · 3 quartos", tipo: "Apartamento", preco: "R$ 850.000", status: "disponivel", icon: "🏠", corretorId: "1" },
  { id: 2, nome: "Casa Alphaville", sub: "Barueri · 320m² · 4 quartos", tipo: "Casa", preco: "R$ 2.400.000", status: "reservado", icon: "🏡", corretorId: "1" },
  { id: 3, nome: "Studio Vila Olímpia", sub: "São Paulo · 42m² · 1 quarto", tipo: "Studio", preco: "R$ 390.000", status: "disponivel", icon: "🏢", corretorId: "3" },
  { id: 4, nome: "Cobertura Pinheiros", sub: "São Paulo · 210m² · 4 quartos", tipo: "Cobertura", preco: "R$ 3.100.000", status: "vendido", icon: "🏠", corretorId: "1" },
  { id: 5, nome: "Apto Grand Tower", sub: "São Paulo · 75m² · 2 quartos", tipo: "Apartamento", preco: "R$ 680.000", status: "lancamento", icon: "🏗", corretorId: "2" },
  { id: 6, nome: "Apartamento Moema", sub: "São Paulo · 120m² · 3 quartos", tipo: "Apartamento", preco: "R$ 1.200.000", status: "disponivel", icon: "🏠", corretorId: "2" },
  { id: 7, nome: "Casa Condomínio São Roque", sub: "São Roque · 250m² · 3 quartos", tipo: "Casa", preco: "R$ 890.000", status: "disponivel", icon: "🏡", corretorId: "3" },
  { id: 8, nome: "Sala Comercial Faria Lima", sub: "São Paulo · 55m²", tipo: "Comercial", preco: "R$ 950.000", status: "disponivel", icon: "🏢", corretorId: "3" },
];

export const empreendimentosMock = [
  { id: 1, nome: "Grand Tower", loc: "Vila Olímpia, São Paulo", status: "lancamento", statusLabel: "Lançamento", unidades: 48, disponiveis: 12, entrega: 2026, icon: "🏢", corretorId: "2" },
  { id: 2, nome: "Residencial Alphaville II", loc: "Barueri, SP", status: "obras", statusLabel: "Em obras", unidades: 24, disponiveis: 8, entrega: 2025, icon: "🏡", corretorId: "2" },
  { id: 3, nome: "Vila das Artes", loc: "Pinheiros, São Paulo", status: "pronto", statusLabel: "Pronto para morar", unidades: 16, disponiveis: 3, entrega: 2024, icon: "🌿", corretorId: "1" },
  { id: 4, nome: "Condomínio Serra Verde", loc: "São Roque, SP", status: "breve", statusLabel: "Breve lançamento", unidades: 32, disponiveis: 32, entrega: 2027, icon: "🏔", corretorId: "3" },
  { id: 5, nome: "Moema Prime", loc: "Moema, São Paulo", status: "obras", statusLabel: "Em obras", unidades: 20, disponiveis: 7, entrega: 2026, icon: "🏙", corretorId: "2" },
  { id: 6, nome: "Riviera Club", loc: "Bertioga, SP", status: "pronto", statusLabel: "Pronto para morar", unidades: 60, disponiveis: 5, entrega: 2023, icon: "🌊", corretorId: "1" },
];
