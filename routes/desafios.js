import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { router } from "./index.js";
import { authIsAdminMiddleware, authMiddleware } from "../middlewares/auth.js";

const desafiosRouter = Router();

desafiosRouter.post("/desafios", authIsAdminMiddleware, (req, res) => {
  try {
    const { musicaId, titulo, descricao, dificuldade } = req.body;
    const usuarioId = req.user.id;

    if (!musicaId || !titulo || !descricao) {
      return res
        .status(400)
        .json({ error: "ID da música, título e descrição são obrigatórios" });
    }

    const musica = router.db.get("musicas").find({ id: musicaId }).value();

    if (!musica) {
      return res.status(404).json({ error: "Música não encontrada" });
    }

    const novoDesafio = {
      id: uuidv4(),
      musicaId,
      usuarioId,
      titulo,
      descricao,
      dificuldade: dificuldade || "facil",
    };

    router.db.get("desafios").push(novoDesafio).write();

    return res.status(201).json(novoDesafio);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar desafio" });
  }
});

desafiosRouter.get("/desafios", authMiddleware, (req, res) => {
  try {
    const { dificuldade } = req.query;
    let desafios = router.db.get("desafios").value();

    // Filtrar por dificuldade se fornecida
    if (dificuldade) {
      desafios = desafios.filter(
        (desafio) =>
          desafio.dificuldade &&
          desafio.dificuldade.toLowerCase() === dificuldade.toLowerCase()
      );
    }

    // Adicionar informações das músicas
    const desafiosComDetalhes = desafios.map((desafio) => {
      const musica = router.db
        .get("musicas")
        .find({ id: desafio.musicaId })
        .value();

      return {
        ...desafio,
        musica,
      };
    });

    return res.status(200).json(desafiosComDetalhes);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar desafios" });
  }
});

desafiosRouter.get("/desafios/:id", authMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const desafio = router.db.get("desafios").find({ id }).value();

    if (!desafio) {
      return res.status(404).json({ error: "Desafio não encontrado" });
    }

    const musica = router.db
      .get("musicas")
      .find({ id: desafio.musicaId })
      .value();

    return res.status(200).json({
      ...desafio,
      musica,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar desafio" });
  }
});

desafiosRouter.put("/desafios/:id", authIsAdminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, dificuldade } = req.body;

    const desafios = router.db.get("desafios");
    const desafio = desafios.find({ id }).value();

    if (!desafio) {
      return res.status(404).json({ error: "Desafio não encontrado" });
    }

    const desafioAtualizado = {
      ...desafio,
      titulo: titulo || desafio.titulo,
      descricao: descricao || desafio.descricao,
      dificuldade: dificuldade || desafio.dificuldade,
    };

    desafios.find({ id }).assign(desafioAtualizado).write();

    return res.status(200).json(desafioAtualizado);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar desafio" });
  }
});

desafiosRouter.delete("/desafios/:id", authIsAdminMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const desafio = router.db.get("desafios").find({ id }).value();

    if (!desafio) {
      return res.status(404).json({ error: "Desafio não encontrado" });
    }

    router.db.get("progresso_desafios").remove({ desafioId: id }).write();

    router.db.get("desafios").remove({ id }).write();

    return res.status(200).json({ message: "Desafio removido com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar desafio" });
  }
});

export default desafiosRouter;
