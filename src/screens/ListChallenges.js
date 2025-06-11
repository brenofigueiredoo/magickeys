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

const ListChallenges = ({ navigation }) => {
  const [arrayList, setArrayList] = useState([]);
  const updateList = async () => {
    try {
      return await API.get(`${BASE_URL}/desafios`)
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
      <Text style={styles.title}>Escolha um desafio</Text>
      <ScrollView style={{ maxWidth: 500, width: "100%" }}>
        {arrayList.map((song, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate("TocarDesafio", { id: song.id })
              }
              style={[
                styles.button,
                {
                  backgroundColor: coresDesafios[index % coresDesafios.length],
                },
              ]}
            >
              <Text key={song.id} style={styles.buttonText}>
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
    backgroundColor: "#11c0f7",
  },
  item: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
  },
  title: {
      marginTop:15,
      color: "#9B59B6",
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
      fontFamily: "Menlo-Regular",
      textShadowColor: "#000",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
  canvas: {},
  text: {
    fontSize: 25,
    color: "black",
    fontWeight: "bold",
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

  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ListChallenges;
