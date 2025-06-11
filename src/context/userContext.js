import { createContext, useEffect, useState } from "react";
import API from "../services/api";
import { BASE_URL } from "../services/urls";
import { returnError } from "../services/error";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [musicasFavoritas, setMusicasFavoritas] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    getProfile();
  }, []);

  const createUser = async (data) => {
    try {
      const response = await API.post(`${BASE_URL}/usuarios`, data);
      return response.data;
    } catch (err) {
      returnError(err);
    }
  };

  const userLogin = async (data) => {
    try {
      const response = await API.post(`${BASE_URL}/usuarios/login`, data);
      return response.data;
    } catch (err) {
      returnError(err);
    }
  };

  const getProfile = async () => {
    try {
      const response = await API.get(`${BASE_URL}/usuarios/me`);
      setUser({
        ...response.data,
        musicasFavoritas: response.data.musicasFavoritas || [],
      });
    } catch (error) {
      returnError(error);
    }
  };

  const getMyChallenges = async (data) => {
    try {
      const response = await API.get(`${BASE_URL}/progresso-desafios`, data);
      return response.data;
    } catch (err) {
      returnError(err);
    }
  };

  const updateUser = async (updateData) => {
    try {
      const response = await API.put(`${BASE_URL}/usuarios/perfil`, {
        nome: updateData.nome,
        img: updateData.img,
      });
      setUser((prev) => ({ ...prev, ...response.data }));
      return response.data;
    } catch (err) {
      returnError(err);
    }
  };

  const isFavorita = async (musicaId) => {
    try {
      const response = await API.get(
        `${BASE_URL}/musicas-favoritas/${musicaId}`
      );
      return response.data;
    } catch (err) {
      return false; // Se der erro, não é favorita
    }
  };

  const fetchFavoritas = async () => {
    try {
      const response = await API.get(`${BASE_URL}/musicas-favoritas`);
      setMusicasFavoritas(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar favoritas:", error);
      return [];
    }
  };

  const toggleFavorita = async (musicaId) => {
    try {
      // Verificar se a música já é favorita
      const favoritoInfo = await isFavorita(musicaId);
      const action = favoritoInfo ? "DELETE" : "POST";
      const url = `${BASE_URL}/musicas-favoritas`;

      let response;

      if (action === "POST") {
        response = await API.post(url, { musicaId });
      } else {
        // Se estamos removendo, usamos o ID do favorito, não o ID da música
        response = await API.delete(`${url}/${favoritoInfo.favorito.id}`);
      }

      if (response.status !== 200 && response.status !== 201)
        throw new Error("Erro ao favoritar/desfavoritar");

      // Após a operação, recarregue as músicas favoritas
      await fetchFavoritas();
      return !favoritoInfo; // Retorna o novo estado
    } catch (error) {
      console.error("Erro ao favoritar:", error);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        setUser,
        user,
        musicasFavoritas,
        createUser,
        userLogin,
        getProfile,
        getMyChallenges,
        updateUser,
        toggleFavorita,
        isFavorita,
        fetchFavoritas,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
