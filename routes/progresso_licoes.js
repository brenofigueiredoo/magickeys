import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { router } from "./index.js";
import { authMiddleware } from "../middlewares/auth.js";

const progressoLicoesRouter = Router();

progressoLicoesRouter.post("/progresso-licoes", authMiddleware, (req, res) => {
	try {
		const { licaoId, porcentagem } = req.body;
		const usuarioId = req.user.id;

		if (!licaoId || porcentagem === undefined) {
			return res
				.status(400)
				.json({ error: "ID da lição e porcentagem são obrigatórios" });
		}

		const licao = router.db.get("licoes").find({ id: licaoId }).value();

		if (!licao) {
			return res.status(404).json({ error: "Lição não encontrada" });
		}

		const progressoExistente = router.db
			.get("progresso_licoes")
			.find({ usuarioId, licaoId })
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
			licaoId,
			porcentagem: Math.min(Math.max(0, porcentagem), 100),
			dataProgresso: new Date().toISOString().split("T")[0],
		};

		router.db.get("progresso_licoes").push(novoProgresso).write();

		return res.status(201).json(novoProgresso);
	} catch (error) {
		return res
			.status(500)
			.json({ error: "Erro ao registrar progresso da lição" });
	}
});

progressoLicoesRouter.get("/progresso-licoes", authMiddleware, (req, res) => {
	try {
		const usuarioId = req.user.id;

		const progressos = router.db
			.get("progresso_licoes")
			.filter({ usuarioId })
			.value();

		const progressosComDetalhes = progressos.map((progresso) => {
			const licao = router.db
				.get("licoes")
				.find({ id: progresso.licaoId })
				.value();

			return {
				...progresso,
				licao,
			};
		});

		return res.status(200).json(progressosComDetalhes);
	} catch (error) {
		return res
			.status(500)
			.json({ error: "Erro ao listar progressos de lições" });
	}
});

progressoLicoesRouter.put(
	"/progresso-licoes/:id",
	authMiddleware,
	(req, res) => {
		try {
			const { id } = req.params;
			const { porcentagem } = req.body;
			const usuarioId = req.user.id;

			if (porcentagem === undefined) {
				return res.status(400).json({ error: "Porcentagem é obrigatória" });
			}

			const progressos = router.db.get("progresso_licoes");
			const progresso = progressos.find({ id, usuarioId }).value();

			if (!progresso) {
				return res.status(404).json({ error: "Progresso não encontrado" });
			}

			const progressoAtualizado = {
				...progresso,
				porcentagem: Math.min(Math.max(0, porcentagem), 100),
				dataProgresso: new Date().toISOString().split("T")[0],
			};

			progressos.find({ id }).assign(progressoAtualizado).write();

			return res.status(200).json(progressoAtualizado);
		} catch (error) {
			return res
				.status(500)
				.json({ error: "Erro ao atualizar progresso da lição" });
		}
	},
);

export default progressoLicoesRouter;
