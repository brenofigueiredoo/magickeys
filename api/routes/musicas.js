import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { router } from "./index.js";
import { authIsAdminMiddleware } from "../middlewares/auth.js";
import path from "node:path";
import fs from "node:fs";
import uploadMidi from "../middlewares/uploadMidi.js";

const musicasRouter = Router();

musicasRouter.post(
	"/musicas",
	authIsAdminMiddleware,
	uploadMidi.single("arquivo"),
	(req, res) => {
		try {
			const { nome, genero } = req.body;
			const usuarioId = req.user.id;

			if (req.file && (!nome || !genero)) {
				fs.unlinkSync(req.file.path);
				return res
					.status(400)
					.json({ error: "Nome e gênero são obrigatórios" });
			}

			if (!nome || !genero || !req.file) {
				return res
					.status(400)
					.json({ error: "Nome e arquivo MIDI são obrigatórios" });
			}

			const arquivoPath = path.resolve(process.cwd(), req.file.path);
			if (!fs.existsSync(arquivoPath)) {
				return res.status(500).json({ error: "Erro ao salvar arquivo MIDI" });
			}

			const urlArquivo = `/uploads/midi/${path.basename(req.file.path)}`;

			const novaMusica = {
				id: uuidv4(),
				nome,
				urlArquivo,
				usuarioId,
				genero,
			};

			router.db.get("musicas").push(novaMusica).write();

			return res.status(201).json(novaMusica);
		} catch (error) {
			return res.status(500).json({ error: "Erro ao criar música" });
		}
	},
);

musicasRouter.get("/musicas", (req, res) => {
	try {
		const { genero } = req.query;
		let musicas = router.db.get("musicas").value();

		if (genero) {
			musicas = musicas.filter(
				(musica) =>
					musica.genero && musica.genero.toLowerCase() === genero.toLowerCase(),
			);
		}

		const musicasComDetalhes = musicas.map((musica) => {
			const usuario = router.db
				.get("usuarios")
				.find({ id: musica.usuarioId })
				.value();

			const { senha, ...usuarioSemSenha } = usuario || {};

			return {
				...musica,
				usuario: usuario ? usuarioSemSenha : null,
			};
		});

		return res.status(200).json(musicasComDetalhes);
	} catch (error) {
		return res.status(500).json({ error: "Erro ao listar músicas" });
	}
});

musicasRouter.get("/musicas/:id", (req, res) => {
	try {
		const { id } = req.params;

		const musica = router.db.get("musicas").find({ id }).value();

		if (!musica) {
			return res.status(404).json({ error: "Música não encontrada" });
		}

		const usuario = router.db
			.get("usuarios")
			.find({ id: musica.usuarioId })
			.value();

		const { senha, ...usuarioSemSenha } = usuario || {};

		return res.status(200).json({
			...musica,
			usuario: usuario ? usuarioSemSenha : null,
		});
	} catch (error) {
		return res.status(500).json({ error: "Erro ao buscar música" });
	}
});

musicasRouter.put("/musicas/:id", authIsAdminMiddleware, (req, res) => {
	try {
		const { id } = req.params;
		const { nome, urlArquivo, genero } = req.body;

		const musicas = router.db.get("musicas");
		const musica = musicas.find({ id }).value();

		if (!musica) {
			return res.status(404).json({ error: "Música não encontrada" });
		}

		const musicaAtualizada = {
			...musica,
			nome: nome || musica.nome,
			urlArquivo: urlArquivo || musica.urlArquivo,
			genero: genero !== undefined ? genero : musica.genero,
		};

		musicas.find({ id }).assign(musicaAtualizada).write();

		return res.status(200).json(musicaAtualizada);
	} catch (error) {
		return res.status(500).json({ error: "Erro ao atualizar música" });
	}
});

musicasRouter.delete("/musicas/:id", authIsAdminMiddleware, (req, res) => {
	try {
		const { id } = req.params;

		const musica = router.db.get("musicas").find({ id }).value();

		if (!musica) {
			return res.status(404).json({ error: "Música não encontrada" });
		}

		router.db.get("licoes").remove({ musicaId: id }).write();

		router.db.get("desafios").remove({ musicaId: id }).write();

		router.db.get("musicas_favoritas").remove({ musicaId: id }).write();

		router.db.get("musicas").remove({ id }).write();

		return res.status(200).json({ message: "Música removida com sucesso" });
	} catch (error) {
		return res.status(500).json({ error: "Erro ao deletar música" });
	}
});

export default musicasRouter;
