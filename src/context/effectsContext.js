import React, { createContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

export const EffectsContext = createContext();

let db = null;

export const EffectsProvider = ({ children }) => {
  const [currentEffect, setCurrentEffect] = useState(null);
  const [isDbReady, setIsDbReady] = useState(false);

  const availableEffects = [
    {
      id: "snow",
      name: "Flocos de Neve",
      description: "Flocos de neve caindo na tela",
      speed: 3,
      quantity: 50,
    },
    {
      id: "stars",
      name: "Estrelas Brilhantes",
      description: "Estrelas que brilham e piscam",
      speed: 1.5,
      quantity: 40,
    },
    {
      id: "bubbles",
      name: "Bolhas Flutuantes",
      description: "Bolhas coloridas que flutuam na tela",
      speed: 4,
      quantity: 30,
    },
  ];

  // Verificar se SQLite está disponível
  const isSQLiteAvailable = () => {
    return Platform.OS !== "web" && SQLite;
  };

  const saveToLocalStorage = (effectId) => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("currentEffect", effectId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
      return false;
    }
  };

  const getFromLocalStorage = () => {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem("currentEffect");
      }
      return null;
    } catch (error) {
      console.error("Erro ao recuperar do localStorage:", error);
      return null;
    }
  };

  const clearFromLocalStorage = () => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("currentEffect");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao limpar localStorage:", error);
      return false;
    }
  };

  useEffect(() => {
    const initStorage = async () => {
      try {
        console.log("Iniciando armazenamento...");
        console.log("Platform:", Platform.OS);
        console.log("SQLite disponível:", isSQLiteAvailable());

        if (isSQLiteAvailable()) {
          console.log("Inicializando Expo SQLite...");
          await initExpoSQLiteDatabase();
        } else {
          console.log("Usando fallback localStorage...");
          await initLocalStorageFallback();
        }
        setIsDbReady(true);
        console.log("Armazenamento inicializado com sucesso");
      } catch (error) {
        console.error("Erro ao inicializar armazenamento:", error);
        setIsDbReady(true);
      }
    };

    const initExpoSQLiteDatabase = async () => {
      try {
        // Abrir ou criar o banco de dados com Expo SQLite
        db = await SQLite.openDatabaseAsync("effects.db");
        console.log("Banco de dados Expo SQLite aberto com sucesso");

        // Criar tabela se não existir
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS user_preferences (
            id INTEGER PRIMARY KEY NOT NULL, 
            effect_id TEXT
          );
        `);
        console.log("Tabela de preferências criada ou já existente");

        // Verificar se já existe uma preferência salva
        const result = await db.getFirstAsync(
          "SELECT * FROM user_preferences WHERE id = 1"
        );

        if (result && result.effect_id) {
          const savedEffect = availableEffects.find(
            (effect) => effect.id === result.effect_id
          );
          if (savedEffect) {
            setCurrentEffect(savedEffect);
            console.log("Efeito salvo recuperado:", savedEffect.name);
          }
        }
      } catch (error) {
        console.error("Erro específico do Expo SQLite:", error);
        // Fallback para localStorage se SQLite falhar
        await initLocalStorageFallback();
      }
    };

    const initLocalStorageFallback = async () => {
      try {
        const savedEffectId = getFromLocalStorage();
        if (savedEffectId) {
          const savedEffect = availableEffects.find(
            (effect) => effect.id === savedEffectId
          );
          if (savedEffect) {
            setCurrentEffect(savedEffect);
            console.log(
              "Efeito salvo recuperado do localStorage:",
              savedEffect.name
            );
          }
        }
      } catch (error) {
        console.error("Erro no fallback localStorage:", error);
      }
    };

    initStorage();
  }, []);

  // Salvar a preferência do usuário
  const saveEffect = async (effectId) => {
    try {
      const effect = availableEffects.find((e) => e.id === effectId);
      if (!effect) {
        console.warn("Efeito não encontrado:", effectId);
        return false;
      }

      let success = false;

      if (isSQLiteAvailable() && db) {
        try {
          // Usar Expo SQLite
          const existingRecord = await db.getFirstAsync(
            "SELECT * FROM user_preferences WHERE id = 1"
          );

          if (existingRecord) {
            await db.runAsync(
              "UPDATE user_preferences SET effect_id = ? WHERE id = 1",
              [effectId]
            );
          } else {
            await db.runAsync(
              "INSERT INTO user_preferences (id, effect_id) VALUES (1, ?)",
              [effectId]
            );
          }
          success = true;
          console.log("Preferência salva no Expo SQLite");
        } catch (sqlError) {
          console.error("Erro ao salvar no Expo SQLite:", sqlError);
          success = saveToLocalStorage(effectId);
          console.log("Usando fallback localStorage para salvar");
        }
      } else {
        success = saveToLocalStorage(effectId);
        console.log("Preferência salva no localStorage");
      }

      if (success) {
        setCurrentEffect(effect);
      }
      return success;
    } catch (error) {
      console.error("Erro ao salvar preferência:", error);
      return false;
    }
  };

  // Limpar efeito atual
  const clearEffect = async () => {
    try {
      let success = false;

      if (isSQLiteAvailable() && db) {
        try {
          await db.runAsync(
            "UPDATE user_preferences SET effect_id = NULL WHERE id = 1"
          );
          success = true;
          console.log("Efeito removido do Expo SQLite");
        } catch (sqlError) {
          console.error("Erro ao limpar no Expo SQLite:", sqlError);
          success = clearFromLocalStorage();
          console.log("Usando fallback localStorage para limpar");
        }
      } else {
        success = clearFromLocalStorage();
        console.log("Efeito removido do localStorage");
      }

      if (success) {
        setCurrentEffect(null);
      }
      return success;
    } catch (error) {
      console.error("Erro ao remover efeito:", error);
      return false;
    }
  };

  return (
    <EffectsContext.Provider
      value={{
        currentEffect,
        availableEffects,
        saveEffect,
        clearEffect,
        isDbReady,
      }}
    >
      {children}
    </EffectsContext.Provider>
  );
};
