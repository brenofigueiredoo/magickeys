import jsonServer from "json-server";
import cors from "cors";
import express from "express";
import usuariosRouter from "./routes/usuarios.js";
import desafiosRouter from "./routes/desafios.js";
import licoesRouter from "./routes/licoes.js";
import musicasRouter from "./routes/musicas.js";
import musicasFavoritasRouter from "./routes/musicas_favoritas.js";
import progressoDesafiosRouter from "./routes/progresso_desafios.js";
import progressoLicoesRouter from "./routes/progresso_licoes.js";
import path from "node:path";

const server = jsonServer.create();
const router = jsonServer.router("../api/db.json");
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Configuração para servir arquivos estáticos da pasta uploads
server.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

server.use(usuariosRouter);
server.use(desafiosRouter);
server.use(licoesRouter);
server.use(musicasRouter);
server.use(musicasFavoritasRouter);
server.use(progressoDesafiosRouter);
server.use(progressoLicoesRouter);

server.use(router);

const port = 3000;

server.listen(port, () => {
  console.log(`JSON Server com autenticação está rodando na porta ${port}`);
});
