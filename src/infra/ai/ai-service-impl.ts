import axios, { AxiosError } from 'axios';
import { AIResponse, AIService } from '../../domain/interfaces/ai-service';
import { logger } from '../logger/logger';
import { openai } from './openai-config';
import { tools, executeCadocTool } from './tools/cadoc-tool';

export class AIServiceImpl implements AIService {
  async generateResponse(prompt: string): Promise<AIResponse> {
    try {
      logger.info('Gerando resposta da IA', { prompt });

      const userMessage = {
        role: 'user' as const,
        content: prompt
      };

      const systemMessage = {
        role: 'system' as const,
        content: 'Você é um assistente especializado. Se identificar que a mensagem do usuário está relacionada a CADOC, use a ferramenta handleCadoc. Caso contrário, responda normalmente.'
      };

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, userMessage],
        tools,
        tool_choice: 'auto'
      });

      const responseMessage = response.choices[0].message;

      if (responseMessage.tool_calls) {
        const toolCall = responseMessage.tool_calls[0];
        if (toolCall.function.name === 'handleCadoc') {
          const args = JSON.parse(toolCall.function.arguments);
          const toolResponse = await executeCadocTool(args);
          return { content: toolResponse };
        }
      }

      logger.info('Resposta da IA gerada com sucesso');
      return { content: responseMessage.content || 'Sem resposta' };
    } catch (error) {
      logger.error('Erro ao gerar resposta da IA', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        prompt
      });

      throw error;
    }
  }
}