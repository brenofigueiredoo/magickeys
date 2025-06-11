import { use, useContext, useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  azulmedio,
  branco,
  preto,
  rosa,
  roxo,
  verdeescuro,
  vermelho,
} from "../colors";
import { getImages } from "../components/GetImages";
import { getIcones } from "../components/GetIcones";
import SideNavigation from "../components/SideNavigation";
import { UserContext } from "../context/userContext";

function MyChallenges({ navigation }) {
  const imagens = getImages();

  const { getMyChallenges } = useContext(UserContext);

  const [myChallenges, setMyChallenges] = useState([]);

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

  useEffect(() => {
    const fetchChallenges = async () => {
      const challenges = await getMyChallenges();
      setMyChallenges(challenges);
    };

    fetchChallenges();
  }, []);

  // Calcular pontuação total
  const calcularPontuacaoTotal = () => {
    if (!myChallenges || myChallenges.length === 0) return 0;
    var myc = myChallenges.reduce(
      (total, challenge) => total + challenge.pontuacao,
      0
    );
    return myc.toFixed(2);
  };

  // Cores para os desafios
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

      {/* Elementos decorativos */}
      <Image
        source={imagens.baloes}
        style={styles.baloes}
        resizeMode="contain"
      />
      <Image
        source={imagens.borboleta}
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
        {/* Título */}
        <Text style={styles.tituloDesafios}>Meus desafios</Text>

        {/* Lista de desafios */}
        <ScrollView style={styles.desafiosContainer}>
          {myChallenges &&
            myChallenges.map((desafio, index) => (
              <View
                key={desafio.id}
                style={[
                  styles.desafioItem,
                  {
                    backgroundColor:
                      coresDesafios[index % coresDesafios.length],
                  },
                ]}
              >
                <Text style={styles.desafioTitulo}>
                  {desafio.desafio?.titulo || "Desafio"}
                </Text>
                <Text style={styles.desafioPontuacao}>
                  {desafio.pontuacao}pts
                </Text>
              </View>
            ))}
        </ScrollView>

        {/* Pontuação total */}
        <View style={styles.pontuacaoContainer}>
          <Text style={styles.pontuacaoTitulo}>PONTUAÇÃO</Text>
          <Text style={styles.pontuacaoTotal}>
            {calcularPontuacaoTotal()}pts
          </Text>
        </View>

        {/* Botão voltar */}
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.botaoVoltarTexto}>VOLTAR</Text>
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
  conteudoPrincipal: {
    flex: 1,
    paddingLeft: 100, // Espaço para a barra lateral
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  tituloDesafios: {
    fontSize: 40,
    fontWeight: "bold",
    color: rosa,
    marginBottom: 20,
  },
  desafiosContainer: {
    maxHeight: 300,
    width: "60%",
  },
  desafioItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 25,
    padding: 15,
    marginBottom: 10,
    borderColor: preto,
    borderWidth: 2,
  },
  desafioTitulo: {
    color: branco,
    fontSize: 18,
    fontWeight: "bold",
  },
  desafioPontuacao: {
    color: branco,
    fontSize: 18,
    fontWeight: "bold",
  },
  pontuacaoContainer: {
    position: "absolute",
    right: 50,
    top: "50%",
    alignItems: "center",
  },
  pontuacaoTitulo: {
    color: branco,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pontuacaoTotal: {
    color: vermelho,
    fontSize: 40,
    fontWeight: "bold",
  },
  botaoVoltar: {
    position: "absolute",
    right: 50,
    bottom: 50,
    backgroundColor: verdeescuro,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  botaoVoltarTexto: {
    color: branco,
    fontSize: 18,
    fontWeight: "bold",
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
});

export default MyChallenges;
