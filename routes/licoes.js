import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { router } from "./index.js";
import { authIsAdminMiddleware } from "../middlewares/auth.js";

const licoesRouter = Router();

licoesRouter.post("/licoes", authIsAdminMiddleware, (req, res) => {
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

		const novaLicao = {
			id: uuidv4(),
			musicaId,
			usuarioId,
			titulo,
			descricao,
			dificuldade: dificuldade || "facil",
		};

		router.db.get("licoes").push(novaLicao).write();

		return res.status(201).json(novaLicao);
	} catch (error) {
		return res.status(500).json({ error: "Erro ao criar lição" });
	}
});

licoesRouter.get("/licoes", (req, res) => {
	try {
		const { dificuldade } = req.query;
		let licoes = router.db.get("licoes").value();

		if (dificuldade) {
			licoes = licoes.filter(
				(licao) =>
					licao.dificuldade &&
					licao.dificuldade.toLowerCase() === dificuldade.toLowerCase(),
			);
		}

		const licoesComDetalhes = licoes.map((licao) => {
			const musica = router.db
				.get("musicas")
				.find({ id: licao.musicaId })
				.value();

			return {
				...licao,
				musica,
			};
		});

		return res.status(200).json(licoesComDetalhes);
	} catch (error) {
		return res.status(500).json({ error: "Erro ao listar lições" });
	}
});

licoesRouter.get("/licoes/:id", (req, res) => {
	try {
		const { id } = req.params;

		const licao = router.db.get("licoes").find({ id }).value();

		if (!licao) {
			return res.status(404).json({ error: "Lição não encontrada" });
		}

		const musica = router.db
			.get("musicas")
			.find({ id: licao.musicaId })
			.value();

		return res.status(200).json({
			...licao,
			musica,
		});
	} catch (error) {
		return res.status(500).json({ error: "Erro ao buscar lição" });
	}
});

licoesRouter.put("/licoes/:id", authIsAdminMiddleware, (req, res) => {
	try {
		const { id } = req.params;
		const { titulo, descricao, dificuldade } = req.body;

		const licoes = router.db.get("licoes");
		const licao = licoes.find({ id }).value();

		if (!licao) {
			return res.status(404).json({ error: "Lição não encontrada" });
		}

		const licaoAtualizada = {
			...licao,
			titulo: titulo || licao.titulo,
			descricao: descricao || licao.descricao,
			dificuldade: dificuldade || licao.dificuldade,
		};

		licoes.find({ id }).assign(licaoAtualizada).write();

		return res.status(200).json(licaoAtualizada);
	} catch (error) {
		return res.status(500).json({ error: "Erro ao atualizar lição" });
	}
});

export default licoesRouter;
