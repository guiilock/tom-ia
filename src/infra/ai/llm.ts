import OpenAI from 'openai';
import { openai } from './openai-config';

type Message = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
  tool_calls?: OpenAI.Chat.ChatCompletionMessageToolCall[];
};

export const runLLM = async (messages: Message[], tools?: any[]): Promise<Message> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      tools,
    });

    const responseMessage = completion.choices[0].message;
    
    return {
      role: responseMessage.role,
      content: responseMessage.content || '',
      tool_calls: responseMessage.tool_calls
    };
  } catch (error) {
    console.error('Erro ao executar LLM:', error);
    throw error;
  }
};