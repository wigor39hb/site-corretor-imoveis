import { z } from "zod";

export const empreendimentoSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  tipo: z.string().min(1, "Tipo obrigatório"),
  status: z.enum(["em-construcao", "pronto", "lancamento"]),
  descricao: z.string().optional(),
  localizacao: z.string().optional(),
  diferenciais: z.array(z.string()).default([]),
  entrega_prevista: z.string().optional(),
});

export type EmpreendimentoFormData = z.infer<typeof empreendimentoSchema>;
