import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = path.join(process.cwd(), "uploads/midi");
		fs.mkdirSync(uploadDir, { recursive: true });
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "audio/midi" || file.mimetype === "audio/mid") {
		cb(null, true);
	} else {
		cb(new Error("Apenas arquivos MIDI são permitidos"), false);
	}
};

const uploadMidi = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
});

export default uploadMidi;
