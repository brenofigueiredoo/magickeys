# Documentação da API Magic Keys

## Autenticação

A API utiliza autenticação via token JWT (JSON Web Token). Para endpoints protegidos, inclua o token no header Authorization:

```
Authorization: Bearer <seu_token>
```

Existem dois níveis de autenticação:
- **authMiddleware**: Requer apenas autenticação do usuário
- **authIsAdminMiddleware**: Requer que o usuário seja administrador

## Endpoints

### Usuários

#### POST /usuarios
Cria um novo usuário.
- **Autenticação**: Não requer
- **Body**:
  ```json
  {
    "email": "string",
    "senha": "string",
    "nome": "string"
  }
  ```

#### POST /usuarios/login
Autentica um usuário.
- **Autenticação**: Não requer
- **Body**:
  ```json
  {
    "email": "string",
    "senha": "string"
  }
  ```

#### GET /usuarios
Lista todos os usuários (apenas admin).
- **Autenticação**: authIsAdminMiddleware

#### GET /usuarios/perfil
Retorna o perfil do usuário logado.
- **Autenticação**: authMiddleware

#### PUT /usuarios/perfil
Atualiza o perfil do usuário.
- **Autenticação**: authMiddleware
- **Body**:
  ```json
  {
    "nome": "string",
    "idade": "string",
    "img": "number",
  }
  ```

#### PUT /usuarios/senha
Atualiza a senha do usuário.
- **Autenticação**: authMiddleware
- **Body**:
  ```json
  {
    "senhaAtual": "string",
    "novaSenha": "string"
  }
  ```

### Músicas

#### POST /musicas
Adiciona uma nova música (apenas admin).
- **Autenticação**: authIsAdminMiddleware
- **Body**:
  ```json
  {
    "titulo": "string",
    "artista": "string",
    "genero": "string",
    "dificuldade": "string",
    "arquivo": "file (MIDI)"
  }
  ```

#### GET /musicas
Lista todas as músicas.
- **Autenticação**: Não requer
- **Query Parameters**:
  - dificuldade (opcional): filtra por dificuldade

#### GET /musicas/:id
Retorna detalhes de uma música específica.
- **Autenticação**: Não requer

#### PUT /musicas/:id
Atualiza uma música (apenas admin).
- **Autenticação**: authIsAdminMiddleware
- **Body**: Mesmos campos do POST

#### DELETE /musicas/:id
Remove uma música (apenas admin).
- **Autenticação**: authIsAdminMiddleware

### Músicas Favoritas

#### POST /musicas-favoritas
Adiciona uma música aos favoritos.
- **Autenticação**: authMiddleware
- **Body**:
  ```json
  {
    "musicaId": "string"
  }
  ```

#### GET /musicas-favoritas
Lista músicas favoritas do usuário.
- **Autenticação**: authMiddleware

#### DELETE /musicas-favoritas/:id
Remove uma música dos favoritos.
- **Autenticação**: authMiddleware

### Lições

#### POST /licoes
Cria uma nova lição (apenas admin).
- **Autenticação**: authIsAdminMiddleware
- **Body**:
  ```json
  {
    "musicaId": "string",
    "titulo": "string",
    "descricao": "string",
    "dificuldade": "string"
  }
  ```

#### GET /licoes
Lista todas as lições.
- **Autenticação**: Não requer
- **Query Parameters**:
  - dificuldade (opcional): filtra por dificuldade

#### GET /licoes/:id
Retorna detalhes de uma lição específica.
- **Autenticação**: Não requer

#### PUT /licoes/:id
Atualiza uma lição (apenas admin).
- **Autenticação**: authIsAdminMiddleware
- **Body**: Mesmos campos do POST

### Progresso das Lições

#### POST /progresso-licoes
Registra progresso em uma lição.
- **Autenticação**: authMiddleware
- **Body**:
  ```json
  {
    "licaoId": "string",
    "pontuacao": "number"
  }
  ```

#### GET /progresso-licoes
Lista progresso das lições do usuário.
- **Autenticação**: authMiddleware

#### PUT /progresso-licoes/:id
Atualiza progresso de uma lição.
- **Autenticação**: authMiddleware
- **Body**:
  ```json
  {
    "pontuacao": "number"
  }
  ```

### Desafios

#### POST /desafios
Cria um novo desafio (apenas admin).
- **Autenticação**: authIsAdminMiddleware
- **Body**:
  ```json
  {
    "musicaId": "string",
    "titulo": "string",
    "descricao": "string",
    "dificuldade": "string"
  }
  ```

#### GET /desafios
Lista todos os desafios.
- **Autenticação**: Não requer
- **Query Parameters**:
  - dificuldade (opcional): filtra por dificuldade

#### GET /desafios/:id
Retorna detalhes de um desafio específico.
- **Autenticação**: Não requer

#### PUT /desafios/:id
Atualiza um desafio (apenas admin).
- **Autenticação**: authIsAdminMiddleware
- **Body**: Mesmos campos do POST

#### DELETE /desafios/:id
Remove um desafio (apenas admin).
- **Autenticação**: authIsAdminMiddleware

### Progresso dos Desafios

#### POST /progresso-desafios
Registra progresso em um desafio.
- **Autenticação**: authMiddleware
- **Body**:
  ```json
  {
    "desafioId": "string",
    "pontuacao": "number"
  }
  ```

#### GET /progresso-desafios
Lista progresso dos desafios do usuário.
- **Autenticação**: authMiddleware

#### PUT /progresso-desafios/:id
Atualiza progresso de um desafio.
- **Autenticação**: authMiddleware
- **Body**:
  ```json
  {
    "pontuacao": "number"
  }
  ```