import { useContext } from "react";
import { UserContext } from "../context/userContext";

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para a tela de login se o usuário não estiver autenticado
 */
const AuthRoute = ({ children, navigation }) => {
  const { user } = useContext(UserContext);

  return user
    ? children
    : navigation.reset({
        index: 0,
        routes: [{ name: "Splash" }],
      });
};

export default AuthRoute;
