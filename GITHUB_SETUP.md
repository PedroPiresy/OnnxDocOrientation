# Configuração do GitHub

Este projeto pode sincronizar automaticamente seus projetos públicos do GitHub!

## Como Configurar

### Opção 1: Usando Variáveis de Ambiente (Recomendado)

1. Crie um arquivo `.env` na raiz do projeto:
```env
VITE_GITHUB_USERNAME=seu-usuario-github
VITE_USE_GITHUB_PROJECTS=true
```

2. Substitua `seu-usuario-github` pelo seu nome de usuário do GitHub real.

3. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Opção 2: Editar o arquivo de configuração diretamente

1. Abra o arquivo `src/config.ts`

2. Altere a linha:
```typescript
export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'seu-usuario-github';
```

Para:
```typescript
export const GITHUB_USERNAME = 'seu-usuario-github'; // Substitua pelo seu username
```

## Como Funciona

- O sistema busca automaticamente seus repositórios públicos do GitHub
- Exibe os 10 projetos mais recentes que possuem descrição
- Usa os **topics** e a **linguagem principal** do repositório como tecnologias
- Mostra estrelas e forks de cada projeto
- Se houver erro ao buscar do GitHub, mostra os projetos estáticos como fallback

## Limitações

- A API pública do GitHub tem limite de 60 requisições por hora por IP
- Apenas repositórios públicos são exibidos
- Apenas repositórios com descrição são mostrados

## Personalização

Você pode ajustar os filtros em `src/services/github.ts`:

- Alterar o número máximo de projetos: mude `.slice(0, 10)` para o número desejado
- Filtrar forks: descomente a linha `return repos.filter(repo => !repo.fork);`
- Ajustar quais topics são mostrados: edite o array `excludedTopics`

