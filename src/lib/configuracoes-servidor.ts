import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { lerConfiguracoes } from "@/lib/configuracoes";

// Lê as configurações uma vez por carregamento de página (layouts e páginas compartilham).
export const getConfiguracoes = cache(async () => lerConfiguracoes(await createClient()));
