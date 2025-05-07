# Magic Keys API

Este é o backend da aplicação Magic Keys, responsável por gerenciar usuários, músicas, lições e desafios.

## Pré-requisitos

- Node.js (versão 20 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2025-1-e3-proj-mov-t5-magickeys.git
```

2. Navegue até a pasta da API:
```bash
cd src/api
```

3. Instale as dependências:
```bash
npm install
```

## Configuração

1. O arquivo `db.json` será criado automaticamente na primeira execução da API

2. A API utiliza um banco de dados JSON para armazenamento dos dados

## Executando a API

1. Inicie o servidor:
```bash
npm start
```

2. A API estará disponível em `http://localhost:3000`

## Autenticação

A API utiliza autenticação via token JWT. Para endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu_token>
```

## Documentação

A documentação completa da API está disponível no arquivo `docs/api.md`.

## Estrutura do Projeto

```
api/
├── docs/           # Documentação da API
├── middlewares/    # Middlewares de autenticação e upload
├── routes/         # Rotas da API
├── uploads/        # Arquivos enviados
├── db.json         # Banco de dados
└── server.js       # Arquivo principal do servidor
```

## Endpoints Principais

- `/usuarios` - Gerenciamento de usuários
- `/musicas` - Gerenciamento de músicas
- `/licoes` - Gerenciamento de lições
- `/desafios` - Gerenciamento de desafios

Para mais detalhes sobre os endpoints, consulte a documentação em `docs/api.md`.