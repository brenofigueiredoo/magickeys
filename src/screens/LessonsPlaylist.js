import { useEffect, useState } from "react";
import {
  StatusBar,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import API from "../services/api";
import { BASE_URL } from "../services/urls";
import { returnError } from "../services/error";
import SideNavigation from "../components/SideNavigation";

const LessonsPlaylist = ({ navigation }) => {
  const [arrayList, setArrayList] = useState([]);
  const updateList = async () => {
    try {
      return await API.get(`${BASE_URL}/licoes`)
        .then((res) => setArrayList(res.data))
        .catch((err) => {
          returnError(err);
        });
    } catch (err) {
      returnError(err);
    }
  };

  useEffect(() => {
    updateList();
  }, []);

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

      <StatusBar hidden={true} />
      <Text style={styles.title}>Escolha uma lição</Text>
      <ScrollView style={{ maxWidth: 500, width: "100%" }}>
        {arrayList.map((song, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate("Lições", {
                  id: song.id,
                  urlArquivo: song.urlArquivo,
                })
              }
              style={[
                styles.button,
                {
                  backgroundColor: coresDesafios[index % coresDesafios.length],
                },
              ]}
            >
              <Text key={song.id} style={styles.text}>
                {song.titulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#11c0f7",
    width: "100%",
    padding: 20,
  },
  item: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
  },
  title: {
    color: "#9B59B6",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Menlo-Regular",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  canvas: {},
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
    flex: 1,
    textAlign: "left",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dropdown: {
    borderColor: "#888",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    padding: 15,
    color: "#000000",
  },
  button: {
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
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default LessonsPlaylist;
