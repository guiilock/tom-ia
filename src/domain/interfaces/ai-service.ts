export interface AIResponse {
  content: string;
}

export interface AIService {
  generateResponse(prompt: string): Promise<AIResponse>;
}