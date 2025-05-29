Trae

# Tom-IA: Assistente Virtual Inteligente
## 🤖 Sobre o Projeto
Tom-IA é um assistente virtual inteligente desenvolvido para o Slack, utilizando a API da OpenAI para processamento de linguagem natural e um sistema modular de ferramentas para execução de tarefas específicas.

## 🔄 Fluxograma do Sistema
```
graph TD
    A[Mensagem do Usuário no Slack] --> B[Slack Event Handler]
    B --> C[AI Service]
    C --> D[OpenAI LLM]
    D --> E{Análise da Mensagem}
    E -->|Requer Ferramenta| F[Sistema de Ferramentas]
    F --> G[Execução da Ferramenta]
    G --> H[Formatação da Resposta]
    E -->|Resposta Direta| H
    H --> I[Resposta ao Usuário]
```
## 🚀 Começando
### Pré-requisitos
- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Conta no Slack com permissões de administrador
- Acesso à API da OpenAI ou servidor interno compatível
### Instalação
1. Clone o repositório:
```
git clone https://github.com/seu-usuario/tom-ia.git
cd tom-ia
```
2. Instale as dependências:
```
npm install
```
3. Configure as variáveis de ambiente:
```
cp .env.example .env
```
Edite o arquivo .env com suas credenciais.

## ⚙️ Configuração
### Variáveis de Ambiente
- SLACK_SIGNING_SECRET : Secret para validação das requisições do Slack
- SLACK_BOT_TOKEN : Token do bot do Slack
- OPENAI_API_KEY : Chave da API OpenAI
- OPENAI_BASE_URL : URL base da API (interna ou OpenAI)
- X_REQUESTER_TOKEN : Token para autenticação interna
## 🛠️ Arquitetura
### Estrutura de Diretórios
```
src/
├── domain/
│   └── interfaces/     # Interfaces e tipos
├── infra/
│   ├── ai/            # Integração com IA
│   │   └── tools/     # Ferramentas modulares
│   └── logger/        # Sistema de logs
└── index.ts          # Ponto de entrada
```
### Sistema de Ferramentas
O projeto utiliza um sistema modular de ferramentas que permite:

- Fácil adição de novas funcionalidades
- Validação de parâmetros com Zod
- Execução assíncrona de tarefas
- Respostas formatadas
## 🔧 Desenvolvimento
### Adicionando Novas Ferramentas
1. Crie um novo arquivo em src/infra/ai/tools/
2. Implemente a interface de ferramenta
3. Adicione validação de parâmetros com Zod
4. Registre a ferramenta no sistema
Exemplo:

```
import { z } from 'zod';
import { createTool } from './base-tool';

export const novaTool = createTool({
  name: 'handleNovaTarefa',
  description: 'Descrição da nova ferramenta',
  parameters: z.object({
    query: z.string().describe('Descrição do parâmetro')
  }),
  execute: async ({ query }) => {
    // Implementação
    return "Resultado";
  }
});
```
## 🧪 Testes
```
npm test
```
## 📦 Deploy
1. Configure as variáveis de ambiente no servidor
2. Execute o build:
```
npm run build
```
3. Inicie o servidor:
```
npm start
```
## 🤝 Contribuindo
1. Faça um fork do projeto
2. Crie uma branch para sua feature ( git checkout -b feature/AmazingFeature )
3. Commit suas mudanças ( git commit -m 'Add some AmazingFeature' )
4. Push para a branch ( git push origin feature/AmazingFeature )
5. Abra um Pull Request
## 📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Autores
- Seu Nome - Trabalho Inicial - seu-usuario
## 📄 Versionamento
Usamos SemVer para controle de versão. Para as versões disponíveis, veja as tags neste repositório .

## 🎉 Agradecimentos
- Time de desenvolvimento
- Contribuidores
- iFood