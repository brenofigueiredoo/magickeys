import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { router } from "./index.js";
import { authMiddleware } from "../middlewares/auth.js";

const musicasFavoritasRouter = Router();

// Rota para adicionar uma música aos favoritos
musicasFavoritasRouter.post(
  "/musicas-favoritas",
  authMiddleware,
  (req, res) => {
    try {
      const { musicaId } = req.body;
      const usuarioId = req.user.id;

      if (!musicaId) {
        return res.status(400).json({ error: "ID da música é obrigatório" });
      }

      // Verifica se a música existe
      const musica = router.db.get("musicas").find({ id: musicaId }).value();

      if (!musica) {
        return res.status(404).json({ error: "Música não encontrada" });
      }

      // Verifica se já está nos favoritos
      const favoritoExistente = router.db
        .get("musicas_favoritas")
        .find({ usuarioId, musicaId })
        .value();

      if (favoritoExistente) {
        return res.status(409).json({
          error: "Música já está nos favoritos",
          favoritoId: favoritoExistente.id,
        });
      }

      // Adiciona a música aos favoritos
      const novoFavorito = {
        id: uuidv4(),
        usuarioId,
        musicaId,
        dataAdicionada: new Date().toISOString().split("T")[0],
      };

      router.db.get("musicas_favoritas").push(novoFavorito).write();

      return res.status(201).json(novoFavorito);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao adicionar música aos favoritos" });
    }
  }
);

// Rota para listar músicas favoritas
musicasFavoritasRouter.get("/musicas-favoritas", authMiddleware, (req, res) => {
  try {
    const usuarioId = req.user.id;

    const favoritos = router.db
      .get("musicas_favoritas")
      .filter({ usuarioId })
      .value();

    const favoritosComDetalhes = favoritos.map((favorito) => {
      const musica = router.db
        .get("musicas")
        .find({ id: favorito.musicaId })
        .value();
      return { ...favorito, musica };
    });

    return res.status(200).json(favoritosComDetalhes);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar músicas favoritas" });
  }
});

// Rota para remover música dos favoritos pelo ID do favorito
musicasFavoritasRouter.delete(
  "/musicas-favoritas/:id",
  authMiddleware,
  (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id;

      const favorito = router.db
        .get("musicas_favoritas")
        .find({ id, usuarioId })
        .value();

      if (!favorito) {
        return res.status(404).json({ error: "Favorito não encontrado" });
      }

      // Remove o favorito
      router.db.get("musicas_favoritas").remove({ id }).write();

      return res
        .status(200)
        .json({ message: "Música removida dos favoritos com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao remover música dos favoritos" });
    }
  }
);

// Rota para remover música dos favoritos pelo ID da música
musicasFavoritasRouter.delete(
  "/musicas-favoritas/musica/:musicaId",
  authMiddleware,
  (req, res) => {
    try {
      const { musicaId } = req.params;
      const usuarioId = req.user.id;

      const favorito = router.db
        .get("musicas_favoritas")
        .find({ musicaId, usuarioId })
        .value();

      if (!favorito) {
        return res.status(404).json({ error: "Favorito não encontrado" });
      }

      // Remove o favorito
      router.db.get("musicas_favoritas").remove({ id: favorito.id }).write();

      return res
        .status(200)
        .json({ message: "Música removida dos favoritos com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao remover música dos favoritos" });
    }
  }
);

musicasFavoritasRouter.get(
  "/musicas-favoritas/:musicaId",
  authMiddleware,
  (req, res) => {
    try {
      const { musicaId } = req.params;
      const usuarioId = req.user.id;

      if (!musicaId) {
        return res.status(400).json({ error: "ID da música é obrigatório" });
      }

      const favoritoEncontrado = router.db
        .get("musicas_favoritas")
        .find({ usuarioId, musicaId })
        .value();

      if (!favoritoEncontrado) {
        return res
          .status(404)
          .json({ error: "Música favorita não encontrada" });
      }

      const musica = router.db.get("musicas").find({ id: musicaId }).value();

      return res.status(200).json({
        favorito: favoritoEncontrado,
        musica: musica,
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar música favorita" });
    }
  }
);

export default musicasFavoritasRouter;
