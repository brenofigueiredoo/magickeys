import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { azulmedio, branco, preto } from "../colors";
import { getIcones } from "../components/GetIcones";
import { getImages } from "../components/GetImages";
import * as ScreenOrientation from "expo-screen-orientation";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFormattedWeather } from "../services/getWather";
import EffectsManager from "../components/effects/EffectsManager";

function Home({ navigation }) {
  const icones = getIcones();
  const imagens = getImages();
  const { user, setUser } = useContext(UserContext);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const handleGetWeatherInfo = async () => {
      try {
        const weather = await getFormattedWeather();
        setWeather(weather);
      } catch (error) {}
    };
    handleGetWeatherInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@TOKEN");
      setUser(null);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

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
      {/* Componente de efeitos especiais */}
      <EffectsManager />

      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>{weather}</Text>
        </View>
      )}
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

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      {/* Botão de Efeitos Especiais */}
      <TouchableOpacity
        style={styles.effectsButton}
        onPress={() => navigation.navigate("EffectsSelector")}
      >
        <Text style={styles.effectsText}>Efeitos</Text>
      </TouchableOpacity>

      {/* Cards de navegação */}
      <View style={styles.cardsContainer}>
        {/* Card Músicas */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ListaMusicas")}
        >
          <Image
            source={icones.playlist}
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>Músicas</Text>
        </TouchableOpacity>

        {/* Card Piano */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Piano")}
        >
          <Image
            source={icones.piano}
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>Piano</Text>
        </TouchableOpacity>

        {/* Card Desafios */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("LessonsPlaylist")}
        >
          <Image
            source={icones.desafios}
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>Lições</Text>
        </TouchableOpacity>

        {/* Por Enquanto */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ListChallenges")}
        >
          <Image
            source={icones.playlist}
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>Desafios</Text>
        </TouchableOpacity>

        {/* Card Perfil */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Image
            source={icones[`perfil${user?.img || 1}`]}
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>Perfil</Text>
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
  logoutButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 10,
    borderWidth: 2,
    borderRadius: 20,
    padding: 5,
  },
  logoutText: {
    color: preto,
    fontWeight: "bold",
    fontSize: 16,
  },
  effectsButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 10,
    borderWidth: 2,
    borderRadius: 20,
    padding: 5,
  },
  effectsText: {
    color: preto,
    fontWeight: "bold",
    fontSize: 16,
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
  weatherContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 6,
    borderRadius: 10,
  },
  weatherText: {
    color: "#000",
    fontSize: 12,
  },
});

export default Home;
