import { z } from 'zod';
import { zodFunction } from 'openai/helpers/zod';

export const exampleTool = {
  name: 'exampleFunction',
  description: 'Descrição do que esta função faz',
  parameters: z.object({
    param1: z.string().describe('Descrição do primeiro parâmetro'),
    param2: z.number().describe('Descrição do segundo parâmetro')
  })
};

export const executeExampleTool = async (args: any) => {
  const { param1, param2 } = args;
  // Implementação da função
  return `Resultado da execução com ${param1} e ${param2}`;
};

export const tools = [exampleTool].map(zodFunction);