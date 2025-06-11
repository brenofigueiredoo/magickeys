import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { azulmedio, rosa, vermelho } from "../colors";
import * as ScreenOrientation from "expo-screen-orientation";
import EffectsManager from "../components/effects/EffectsManager";

const Splash = ({ navigation }) => {
  useEffect(() => {
    // Definir orientação como landscape (horizontal) quando o componente for montado
    const setLandscapeOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    setLandscapeOrientation();

    // Usar o evento de foco para garantir que a orientação seja sempre horizontal
    // quando a tela Splash estiver em foco
    const unsubscribe = navigation.addListener("focus", () => {
      setLandscapeOrientation();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <EffectsManager />

      <Image
        source={require("../../assets/imagens/nuvemgrande.png")}
        style={styles.nuvemGrande}
        resizeMode="contain"
      />
      <Image
        source={require("../../assets/imagens/nuvempequena.png")}
        style={styles.nuvemPequena}
        resizeMode="contain"
      />
      <Image
        source={require("../../assets/imagens/nomeaplicativo.png")}
        style={styles.titulo}
        resizeMode="contain"
      />
      <Image
        source={require("../../assets/imagens/notasmusicais.png")}
        style={styles.notasMusicais}
        resizeMode="contain"
      />
      <Image
        source={require("../../assets/imagens/baloes.png")}
        style={styles.baloes}
        resizeMode="contain"
      />

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoComecar}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.botaoTexto}>COMEÇAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoLogin}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.botaoTexto}>LOGIN</Text>
        </TouchableOpacity>
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
  nuvemGrande: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 150,
    height: 100,
  },
  nuvemPequena: {
    position: "absolute",
    top: 40,
    right: 30,
    width: 100,
    height: 70,
  },
  titulo: {
    position: "absolute",
    top: "30%",
    alignSelf: "center",
    width: 300,
    height: 100,
  },
  notasMusicais: {
    position: "absolute",
    bottom: 30,
    left: 30,
    width: 120,
    height: 120,
  },
  baloes: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 120,
    height: 120,
  },
  botoesContainer: {
    position: "absolute",
    bottom: "15%",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
  },
  botaoComecar: {
    backgroundColor: rosa,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: 200,
    alignItems: "center",
  },
  botaoLogin: {
    backgroundColor: vermelho,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: 200,
    alignItems: "center",
  },
  botaoTexto: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Splash;
