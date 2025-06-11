import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { router } from "./index.js";
import {
  authIsAdminMiddleware,
  authMiddleware,
  createToken,
  isAuthenticated,
} from "../middlewares/auth.js";
import bcrypt from "bcrypt";

const usuariosRouter = Router();

usuariosRouter.post("/usuarios", (req, res) => {
  try {
    const { nome, email, senha, idade, img } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Nome, email e senha são obrigatórios" });
    }

    const usuarioExistente = router.db.get("usuarios").find({ email }).value();

    if (usuarioExistente) {
      return res.status(409).json({ error: "Email já está em uso" });
    }

    const senhaCriptografada = bcrypt.hashSync(senha, 10);

    const novoUsuario = {
      id: uuidv4(),
      nome,
      email,
      senha: senhaCriptografada,
      idade: idade || null,
      img: img || 1,
      dataCadastro: new Date().toISOString().split("T")[0],
      ehAdmin: false,
    };

    router.db.get("usuarios").push(novoUsuario).write();

    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    return res.status(201).json(usuarioSemSenha);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

usuariosRouter.post("/usuarios/login", (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const usuario = isAuthenticated({ email, senha });

    if (!usuario) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const token = createToken({
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      ehAdmin: usuario.ehAdmin,
    });

    const { senha: _, ...usuarioSemSenha } = usuario;

    return res.status(200).json({
      usuario: usuarioSemSenha,
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao realizar login" });
  }
});

usuariosRouter.get("/usuarios", authIsAdminMiddleware, (req, res) => {
  try {
    const usuarios = router.db
      .get("usuarios")
      .map(({ senha, ...usuarioSemSenha }) => usuarioSemSenha)
      .value();

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

usuariosRouter.get("/usuarios/perfil", authMiddleware, (req, res) => {
  try {
    const usuarioId = req.user.id;
    dd;

    const usuario = router.db.get("usuarios").find({ id: usuarioId }).value();

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const { senha, ...usuarioSemSenha } = usuario;

    return res.status(200).json(usuarioSemSenha);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

usuariosRouter.put("/usuarios/perfil", authMiddleware, (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { nome, idade, img } = req.body;

    const usuarios = router.db.get("usuarios");
    const usuario = usuarios.find({ id: usuarioId }).value();

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const usuarioAtualizado = {
      ...usuario,
      nome: nome || usuario.nome,
      idade: idade !== undefined ? idade : usuario.idade,
      img: img !== undefined ? img : usuario.img,
    };

    usuarios.find({ id: usuarioId }).assign(usuarioAtualizado).write();

    const { senha, ...usuarioSemSenha } = usuarioAtualizado;

    return res.status(200).json(usuarioSemSenha);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

usuariosRouter.put("/usuarios/senha", (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res
        .status(400)
        .json({ error: "Senha atual e nova senha são obrigatórias" });
    }

    const usuarios = router.db.get("usuarios");
    const usuario = usuarios.find({ id: usuarioId }).value();

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (!bcrypt.compareSync(senhaAtual, usuario.senha)) {
      return res.status(401).json({ error: "Senha atual incorreta" });
    }

    const senhaCriptografada = bcrypt.hashSync(novaSenha, 10);

    const usuarioAtualizado = {
      ...usuario,
      senha: senhaCriptografada,
    };

    usuarios.find({ id: usuarioId }).assign(usuarioAtualizado).write();

    return res.status(200).json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao alterar senha" });
  }
});

usuariosRouter.get("/usuarios/me", authMiddleware, (req, res) => {
  try {
    const usuarioId = req.user.id;

    const usuarios = router.db.get("usuarios");
    const usuario = usuarios.find({ id: usuarioId }).value();

    const { senha, ...usuarioSemSenha } = usuario;

    return res.status(200).json(usuarioSemSenha);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

export default usuariosRouter;
