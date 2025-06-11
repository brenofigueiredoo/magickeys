import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import { router } from "../routes/index.js";
import bcrypt from "bcrypt";

const SECRET_KEY = "magickeys-secret-key";

const expiresIn = "7d";

const createToken = (payload) => {
  return sign(payload, SECRET_KEY, { expiresIn });
};

const verifyToken = (token) => {
  return verify(token, SECRET_KEY);
};

const isAuthenticated = ({ email, senha }) => {
  const userdb = router.db.get("usuarios").value();
  const user = userdb.find((user) => user.email === email);
  if (!user) return null;
  if (senha === user.senha) return user;
  return bcrypt.compareSync(senha, user.senha) ? user : null;
};

const isAdmin = (userId) => {
  const userdb = router.db.get("usuarios").value();
  const user = userdb.find((user) => user.id === userId);
  return user && user.ehAdmin === true;
};

const authIsAdminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    try {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      const decodedToken = verifyToken(token);
      req.user = decodedToken;

      if (!isAdmin(req.user.id)) {
        return res.status(403).json({
          error:
            "Acesso negado. Apenas administradores podem realizar esta operação.",
        });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ error: "Token inválido" });
    }
  }

  return res.status(401).json({ error: "Autenticação necessária" });
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    try {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      const decodedToken = verifyToken(token);
      req.user = decodedToken;

      return next();
    } catch (error) {
      return res.status(401).json({ error: "Token inválido" });
    }
  }

  return res.status(401).json({ error: "Autenticação necessária" });
};

export {
  createToken,
  verifyToken,
  isAuthenticated,
  isAdmin,
  authIsAdminMiddleware,
  authMiddleware,
};
