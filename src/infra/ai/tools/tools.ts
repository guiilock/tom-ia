import { z } from 'zod';
import { zodFunction } from 'openai/helpers/zod';
import { createTool } from './base-tool';

// Ferramenta CADOC
export const cadocTool = createTool({
  name: 'handleCadoc',
  description: 'Função para tratar assuntos relacionados a CADOC',
  parameters: z.object({
    query: z.string().describe('A mensagem do usuário relacionada a CADOC')
  }),
  execute: async ({ query }) => {
    return "Aqui está o seu cadoc";
  }
});

// Ferramenta para outro assunto (exemplo)
export const outroAssuntoTool = createTool({
  name: 'handleOutroAssunto',
  description: 'Função para tratar outro tipo de assunto',
  parameters: z.object({
    query: z.string().describe('A mensagem do usuário relacionada ao outro assunto')
  }),
  execute: async ({ query }) => {
    return "Resposta para outro assunto";
  }
});

// Exporta todas as ferramentas
export const tools = [
  cadocTool,
  outroAssuntoTool,
  // Adicione mais ferramentas aqui
].map(zodFunction);