// Interface base para parâmetros de ferramentas
interface BaseToolParams {
  query: string;
}

// Interface base para definição de ferramentas
interface ToolDefinition<T extends BaseToolParams> {
  name: string;
  description: string;
  parameters: import('zod').ZodType<T>;
  execute: (args: T) => Promise<string>;
}

// Função auxiliar para criar uma nova ferramenta
export function createTool<T extends BaseToolParams>(definition: ToolDefinition<T>) {
  return {
    name: definition.name,
    description: definition.description,
    parameters: definition.parameters,
    execute: definition.execute
  };
}