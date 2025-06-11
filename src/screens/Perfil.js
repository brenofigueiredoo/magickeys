import React, { useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { azulmedio, branco, preto, rosa, roxo } from "../colors";
import { getImages } from "../components/GetImages";
import { getIcones } from "../components/GetIcones";
import * as ScreenOrientation from "expo-screen-orientation";
import SideNavigation from "../components/SideNavigation";
import { UserContext } from "../context/userContext";

const Perfil = ({ navigation }) => {
  const imagens = getImages();
  const icones = getIcones();

  const { user, getProfile } = useContext(UserContext);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    // Definir orientação como landscape (horizontal) quando o componente for montado
    const setLandscapeOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    setLandscapeOrientation();

    // Usar o evento de foco para garantir que a orientação seja sempre horizontal
    // quando a tela Perfil estiver em foco
    const unsubscribe = navigation.addListener("focus", () => {
      setLandscapeOrientation();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SideNavigation navigation={navigation} />

      {/* Elementos decorativos */}
      <Image
        source={imagens.baloes}
        style={styles.baloes}
        resizeMode="contain"
      />
      <Image
        source={imagens.bolhasimples}
        style={styles.bolhaSimples}
        resizeMode="contain"
      />
      <Image
        source={imagens.notasmusicais}
        style={styles.notasMusicais}
        resizeMode="contain"
      />

      {/* Conteúdo principal */}
      <View style={styles.conteudoPrincipal}>
        {/* Avatar do usuário */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("EditarPerfil")}
        >
          <Text style={styles.titulo}>Meu perfil</Text>
          <Image
            source={icones[`perfil${user?.img || 1}`]} // foto atual
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>{user?.nome || ""}</Text>
        </TouchableOpacity>

        {/* Botões de opções */}
        <View style={styles.opcoesContainer}>
          <TouchableOpacity
            style={[styles.botaoOpcao, styles.botaoEditar]}
            onPress={() => navigation.navigate("EditarPerfil")}
          >
            <Text style={styles.botaoTexto}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botaoOpcao, styles.botaoNotas]}
          onPress={() => navigation.navigate("MyLessons")}
          >
            <Text style={styles.botaoTexto}>Lições</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoOpcao, styles.botaoDesafios]}
            onPress={() => navigation.navigate("MyChallenges")}
          >
            <Text style={styles.botaoTexto}>Desafios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botaoOpcao, styles.botaoMusicas]}
            onPress={() => navigation.navigate("Favoritas")}
          >
            <Text style={styles.botaoTexto}>Músicas preferidas</Text>
          </TouchableOpacity>

          {user?.ehAdmin && (
            <TouchableOpacity
              style={[styles.botaoOpcao, styles.botaoNotas]}
              onPress={() => navigation.navigate("Admin")}
            >
              <Text style={styles.botaoTexto}>Área de Admin</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: azulmedio,
    position: "relative",
    overflow: "hidden",
  },
  titulo: {
    color: rosa,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  baloes: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 120,
    height: 120,
  },
  notasMusicais: {
    position: "absolute",
    bottom: 20,
    width: 120,
    height: 120,
  },
  bolhaSimples: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 100,
    height: 100,
  },
  conteudoPrincipal: {
    flexDirection: "row",
    marginTop: 65,
    marginLeft: 100,
    alignItems: "center",
    gap: 30,
  },
  opcoesContainer: {
    flex: 1,
    paddingRight: 0,
  },
  botaoOpcao: {
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 8,
    width: 380,
    borderColor: preto,
    borderWidth: 2,
  },
  botaoTexto: {
    color: branco,
    fontSize: 18,
    fontWeight: "bold",
  },
  botaoEditar: {
    backgroundColor: "#D35D6E", // Vermelho rosado
  },
  botaoDesafios: {
    backgroundColor: "#2A7886", // Verde azulado
  },
  botaoNotas: {
    backgroundColor: "#1E3888", // Azul escuro
  },
  botaoHabilidades: {
    backgroundColor: rosa, // Rosa escuro
  },
  botaoMusicas: {
    backgroundColor: "rgb(168 94 235)", // Roxo
  },
  card: {
    width: 150,
    height: 150,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  cardIcon: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  cardText: {
    color: branco,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Perfil;
