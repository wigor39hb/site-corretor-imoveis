import { z } from "zod";

export const imovelSchema = z.object({
  titulo: z.string().min(3, "Título obrigatório"),
  tipo: z.enum(["apartamento", "casa", "terreno", "comercial"]),
  status: z.enum(["disponivel", "vendido", "reservado", "lancamento"]),
  preco: z.coerce.number().positive().optional().nullable(),
  area: z.coerce.number().positive().optional().nullable(),
  quartos: z.coerce.number().int().min(0).default(0),
  banheiros: z.coerce.number().int().min(0).default(0),
  vagas: z.coerce.number().int().min(0).default(0),
  endereco: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().length(2).optional(),
  cep: z.string().optional(),
  descricao: z.string().optional(),
  destaque: z.boolean().default(false),
  empreendimento_id: z.string().uuid().optional().nullable(),
});

export type ImovelFormData = z.infer<typeof imovelSchema>;
