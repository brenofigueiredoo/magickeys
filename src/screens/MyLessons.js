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
import API from "../services/api";
import { BASE_URL } from "../services/urls";
import { returnError } from "../services/error";

function MyLessons({ navigation }) {
  const { user, getProfile } = useContext(UserContext);
  const imagens = getImages();

  const [myLessons, setMyLessons] = useState([]);

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
    const fetchLessons = async () => {
      const lessons = await getLessonProgress();
      setMyLessons(lessons);
    };
    //getLessonProgress();
    getLessons();
    const loadData = async () => {
      await filteredArray();
    };

    loadData();

    fetchLessons();
  }, []);

  // Calcular pontuação total
  const calcularPontuacaoTotal = () => {
    if (!myLessons || myLessons.length === 0) return 0;
    return myChallenges.reduce((total, lesson) => total + lesson.pontuacao, 0);
  };

  // Cores para os desafios
  const coresDesafios = [
    "#E74C3C", // vermelho
    "#16A085", // verde
    "#2980B9", // azul
    "#D81B60", // rosa
    "#9B59B6", // roxo
  ];

  const [arrayList, setArrayList] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [totalPontos, setTotalPontos] = useState(0);

  const filteredArray = async () => {
    console.log("Function filteredArray called: ");

    for (var i = 0; i < arrayList.length; i++) {
      lessons.forEach((element) => {
        if (arrayList[i].licaoId === element.id) {
          // arrayList[i].licao.titulo = element.musica.nome;
          console.log(arrayList[i].licao.titulo);
          setTotalPontos(totalPontos + arrayList[i].porcentagem);
        }
      });
    }

    //console.log("Array List: ", arrayList);
    const filteredByUser = arrayList.filter((item) => item.userId === user.id);
    setArrayList(filteredByUser);
    //console.log("Filtered: ", arrayList);
    console.log("Total Pontos: ", totalPontos);
  };

  const getLessonProgress = async () => {
    try {
      return await API.get(`${BASE_URL}/progresso-licoes`)
        .then((res) => {
          setArrayList(res.data);
          //Filtra os progressos do usuário atual
          //console.log(res.data);
          //const mylicoes = arrayList.filter(item => item.usuarioId === "550e8400-e29b-41d4-a716-446655440001");
          //console.log(mylicoes);
          //console.log(user.id);
          //console.log(arrayList);
        })
        .catch((err) => {
          console.log(err);
          returnError(err);
        });
    } catch (err) {
      console.log(err);
      returnError(err);
    }
  };

  const getLessons = async () => {
    try {
      return await API.get(`${BASE_URL}/licoes`)
        .then((res) => {
          setLessons(res.data);
          //console.log("Lessons: ", res.data);
        })
        .catch((err) => {
          console.log(err);
          returnError(err);
        });
    } catch (err) {
      console.log(err);
      returnError(err);
    }
  };

  console.log("arrayList: ", arrayList);

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
        <Text style={styles.tituloDesafios}>Minhas lições</Text>

        {/* Lista de desafios */}
        <ScrollView style={styles.desafiosContainer}>
          {arrayList &&
            arrayList.map((licao, index) => (
              <View
                key={licao.id}
                style={[
                  styles.desafioItem,
                  {
                    backgroundColor:
                      coresDesafios[index % coresDesafios.length],
                  },
                ]}
              >
                <Text style={styles.desafioTitulo}>{licao.licao.titulo}</Text>
                <Text style={styles.desafioPontuacao}>
                  {licao.porcentagem}%
                </Text>
              </View>
            ))}
        </ScrollView>

        {/* Pontuação total */}
        {/* <View style={styles.pontuacaoContainer}>
          <Text style={styles.pontuacaoTitulo}>PONTUAÇÃO</Text>
          <Text style={styles.pontuacaoTotal}>{totalPontos}pts</Text>
        </View> */}

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

export default MyLessons;
