import { useContext } from "react";
import { UserContext } from "../context/userContext";

/**
 * Componente para proteger rotas que requerem autenticação de admin
 * Redireciona para a tela de login se o usuário não estiver autenticado
 */
const AuthAdminRoute = ({ children, navigation }) => {
  const { user } = useContext(UserContext);

  return user
    ? children
    : navigation.reset({
        index: 0,
        routes: [{ name: "Splash" }],
      });
};

export default AuthAdminRoute;
