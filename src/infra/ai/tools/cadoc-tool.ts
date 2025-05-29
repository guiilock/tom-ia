import { z } from 'zod';
import { zodFunction } from 'openai/helpers/zod';

export const cadocTool = {
  name: 'handleCadoc',
  description: 'Função para tratar assuntos relacionados a CADOC',
  parameters: z.object({
    query: z.string().describe('A mensagem do usuário relacionada a CADOC')
  })
};

export const executeCadocTool = async (args: { query: string }) => {
  return "Aqui está o seu cadoc";
};

export const tools = [cadocTool].map(zodFunction);