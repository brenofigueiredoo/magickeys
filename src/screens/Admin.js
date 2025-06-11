import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { azulmedio, branco } from "../colors";
import { getIcones } from "../components/GetIcones";
import { getImages } from "../components/GetImages";
import * as ScreenOrientation from "expo-screen-orientation";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import SideNavigation from "../components/SideNavigation";

function Admin({ navigation }) {
  const icones = getIcones();
  const imagens = getImages();
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Definir orientação como landscape (horizontal) quando o componente for montado
    const setLandscapeOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    setLandscapeOrientation();

    // Usar o evento de foco para garantir que a orientação seja sempre horizontal
    // quando a tela Home estiver em foco
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
        source={imagens.bolhasduplas}
        style={styles.bolhasDuplas}
        resizeMode="contain"
      />
      <Image
        source={imagens.baloes}
        style={styles.baloes}
        resizeMode="contain"
      />
      <Image
        source={imagens.nomeaplicativo}
        style={styles.titulo}
        resizeMode="contain"
      />
      <Image
        source={imagens.notasmusicais}
        style={styles.notasMusicais}
        resizeMode="contain"
      />
      <Image
        source={imagens.bolhasimples}
        style={styles.bolhaSimples}
        resizeMode="contain"
      />

      {/* Cards de navegação */}
      <View style={styles.cardsContainer}>
        {/* Card Músicas */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Playlist")}
        >
          <Image
            source={icones.playlist}
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>Músicas</Text>
        </TouchableOpacity>

        {/* Card Desafios */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ListLessons")}
        >
          <Image
            source={icones.desafios}
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>Lições</Text>
        </TouchableOpacity>

        {/* Card Desafios */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Desafios")}
        >
          <Image
            source={icones.piano}
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>Desafios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: azulmedio,
    position: "relative",
    overflow: "hidden",
  },
  titulo: {
    position: "absolute",
    top: "10%",
    alignSelf: "center",
    width: 300,
    height: 100,
  },
  bolhasDuplas: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 100,
    height: 100,
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
    left: 20,
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
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "27%",
    width: "100%",
    // paddingLeft: 80, // Adicionado para compensar a barra lateral
  },
  card: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  cardIcon: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  cardText: {
    color: branco,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Admin;
