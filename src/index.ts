import 'dotenv/config';
import { App } from '@slack/bolt';
import { AIServiceImpl } from './infra/ai/ai-service-impl';
import { logger } from './infra/logger/logger';
import { runLLM } from './infra/ai/llm';
import { tools, executeExampleTool } from './infra/ai/tools/example-tool';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const aiService = new AIServiceImpl();

// Middleware de logging
app.use(async ({ context, next }) => {
  logger.info('Novo evento recebido', { type: context.type });
  await next();
});

// Handler para menções ao bot
app.event('app_mention', async ({ event, say }) => {
  try {
    logger.info('Menção ao bot recebida', { 
      user: event.user, 
      text: event.text,
      channel: event.channel,
      thread_ts: event.thread_ts
    });

    // Remove a menção ao bot da mensagem
    const cleanMessage = event.text.replace(/<@[A-Z0-9]+>/g, '').trim();

    const response = await aiService.generateResponse(cleanMessage);

    await say({
      text: `<@${event.user}> ${response.content}`,
      thread_ts: event.thread_ts || event.ts
    });

    logger.info('Resposta enviada com sucesso', { channel: event.channel });
  } catch (error) {
    logger.error('Erro ao processar menção', { error });

    const errorMessage = error instanceof Error ? 
      `Erro: ${error.message}` : 
      'Ocorreu um erro inesperado ao processar sua mensagem';

    await say({
      text: `<@${event.user}> ${errorMessage}`,
      thread_ts: event.thread_ts || event.ts
    });
  }
});

// Iniciar o servidor
(async () => {
  try {
    const port = process.env.PORT || 3000;
    await app.start(port);
    logger.info(`⚡️ Bolt app está rodando na porta ${port}!`);
  } catch (error) {
    logger.error('Erro ao iniciar o servidor', { error });
    process.exit(1);
  }
})();

const handleMessage = async (message: string) => {
  const systemMessage = {
    role: 'system' as const,
    content: `Você é um assistente que ajuda a escolher e executar funções apropriadas com base no input do usuário.
             Você tem acesso às seguintes ferramentas e deve escolher a mais adequada para a tarefa.`
  };

  const userMessage = {
    role: 'user' as const,
    content: message
  };

  const response = await runLLM([systemMessage, userMessage], tools);

  if (response.content) {
    return response.content;
  }

  if (!response.tool_calls?.length) {
    return 'Não encontrei uma ferramenta adequada para essa solicitação.';
  }

  // Processa cada chamada de ferramenta
  const toolResults = await Promise.all(
    response.tool_calls.map(async (toolCall) => {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments || '{}');

      let toolResponse = '';
      switch (toolName) {
        case 'exampleFunction':
          toolResponse = await executeExampleTool(toolArgs);
          break;
        default:
          toolResponse = 'Ferramenta não encontrada';
      }

      return {
        role: 'tool' as const,
        content: toolResponse,
        tool_call_id: toolCall.id
      };
    })
  );

  // Obtém resposta final com os resultados das ferramentas
  const finalResponse = await runLLM([
    systemMessage,
    userMessage,
    response,
    ...toolResults
  ]);

  return finalResponse.content || 'Não foi possível processar a resposta';
};