import { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { azulmedio, branco, roxo } from "../colors";
import { getImages } from "../components/GetImages";
import * as ScreenOrientation from "expo-screen-orientation";
import SideNavigation from "../components/SideNavigation";
import { UserContext } from "../context/userContext";

const Favoritas = ({ navigation }) => {
  const imagens = getImages();
  const { toggleFavorita, musicasFavoritas, fetchFavoritas } =
    useContext(UserContext);

  useEffect(() => {
    fetchFavoritas();
  }, []);

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };
    lockOrientation();
    return navigation.addListener("focus", lockOrientation);
  }, [navigation]);

  const coresDesafios = [
    "#E74C3C", // vermelho
    "#16A085", // verde
    "#2980B9", // azul
    "#D81B60", // rosa
    "#9B59B6", // roxo
  ];

  return (
    <View style={styles.container}>
      <SideNavigation navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={imagens.baloes}
          style={styles.decoracaoBaloes}
          resizeMode="contain"
        />
        <Image
          source={imagens.bolhasduplas}
          style={styles.bolhasDuplas}
          resizeMode="contain"
        />
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>Músicas Favoritas</Text>

          {musicasFavoritas.length === 0 ? (
            <Text style={styles.textoVazio}>
              Nenhuma música favoritada ainda!
            </Text>
          ) : (
            <View style={styles.botoesContainer}>
              {musicasFavoritas.map((musica, index) => (
                <TouchableOpacity
                  key={musica.musica.id}
                  style={[
                    styles.botaoMusica,
                    {
                      backgroundColor:
                        coresDesafios[index % coresDesafios.length],
                    },
                  ]}
                >
                  <View style={styles.botaoContent}>
                    <Text style={styles.textoBotao}>{musica.musica.nome}</Text>
                    <TouchableOpacity
                      onPress={async (e) => {
                        e.stopPropagation();
                        await toggleFavorita(musica.musicaId);
                        fetchFavoritas();
                      }}
                      style={styles.favoritoButton}
                    >
                      <Ionicons
                        name="heart"
                        size={28}
                        color="red"
                        style={[
                          styles.favoritoIcon,
                          {
                            textShadowColor: "rgba(0, 0, 0, 0.75)",
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 2,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: azulmedio },
  scrollContent: { flexGrow: 1, paddingVertical: 30 },
  conteudo: { flex: 1, alignItems: "center", paddingHorizontal: 20 },
  titulo: {
    color: roxo,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Menlo-Regular",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  decoracaoBaloes: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 100,
    height: 100,
    zIndex: -1,
  },
  bolhasDuplas: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 100,
    height: 80,
  },
  botoesContainer: { 
    width: "50%", 
    marginVertical: 15 
  },
  
  botaoMusica: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 12,
    borderWidth: 3,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botaoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoBotao: {
    color: branco,
    fontWeight: "bold",
    fontSize: 17,
    flex: 1,
    textAlign: "left",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  favoritoButton: {
    padding: 3,
    marginLeft: 8,
  },
  favoritoIcon: {
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Favoritas;
