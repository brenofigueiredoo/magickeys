import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { router } from "./index.js";
import { authMiddleware } from "../middlewares/auth.js";

const progressoDesafiosRouter = Router();

progressoDesafiosRouter.post(
	"/progresso-desafios",
	authMiddleware,
	(req, res) => {
		try {
			const { desafioId, pontuacao } = req.body;
			const usuarioId = req.user.id;

			if (!desafioId || pontuacao === undefined) {
				return res
					.status(400)
					.json({ error: "ID do desafio e pontuação são obrigatórios" });
			}

			const desafio = router.db.get("desafios").find({ id: desafioId }).value();

			if (!desafio) {
				return res.status(404).json({ error: "Desafio não encontrado" });
			}

			const progressoExistente = router.db
				.get("progresso_desafios")
				.find({ usuarioId, desafioId })
				.value();

			if (progressoExistente) {
				return res.status(409).json({
					error: "Progresso já registrado. Use a rota de atualização.",
					progressoId: progressoExistente.id,
				});
			}

			const novoProgresso = {
				id: uuidv4(),
				usuarioId,
				desafioId,
				pontuacao: Math.min(Math.max(0, pontuacao), 100), // Garantir que esteja entre 0 e 100
				dataProgresso: new Date().toISOString().split("T")[0],
			};

			router.db.get("progresso_desafios").push(novoProgresso).write();

			return res.status(201).json(novoProgresso);
		} catch (error) {
			return res
				.status(500)
				.json({ error: "Erro ao registrar progresso do desafio" });
		}
	},
);

progressoDesafiosRouter.get(
	"/progresso-desafios",
	authMiddleware,
	(req, res) => {
		try {
			const usuarioId = req.user.id;

			const progressos = router.db
				.get("progresso_desafios")
				.filter({ usuarioId })
				.value();

			const progressosComDetalhes = progressos.map((progresso) => {
				const desafio = router.db
					.get("desafios")
					.find({ id: progresso.desafioId })
					.value();

				return {
					...progresso,
					desafio,
				};
			});

			return res.status(200).json(progressosComDetalhes);
		} catch (error) {
			return res
				.status(500)
				.json({ error: "Erro ao listar progressos de desafios" });
		}
	},
);

progressoDesafiosRouter.put(
	"/progresso-desafios/:id",
	authMiddleware,
	(req, res) => {
		try {
			const { id } = req.params;
			const { pontuacao } = req.body;
			const usuarioId = req.user.id;

			if (pontuacao === undefined) {
				return res.status(400).json({ error: "Pontuação é obrigatória" });
			}

			const progressos = router.db.get("progresso_desafios");
			const progresso = progressos.find({ id, usuarioId }).value();

			if (!progresso) {
				return res.status(404).json({ error: "Progresso não encontrado" });
			}

			const progressoAtualizado = {
				...progresso,
				pontuacao: Math.min(Math.max(0, pontuacao), 100),
				dataProgresso: new Date().toISOString().split("T")[0],
			};

			progressos.find({ id }).assign(progressoAtualizado).write();

			return res.status(200).json(progressoAtualizado);
		} catch (error) {
			return res
				.status(500)
				.json({ error: "Erro ao atualizar progresso do desafio" });
		}
	},
);

export default progressoDesafiosRouter;
