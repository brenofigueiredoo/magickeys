import React, { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { azulmedio, branco, preto, vermelho } from "../colors";
import * as ScreenOrientation from "expo-screen-orientation";
import { RadioButton } from "react-native-paper";
import API from "../services/api";
import { BASE_URL } from "../services/urls";
import { returnError } from "../services/error";
import { UserContext } from "../context/userContext";
import { Menu, Button, Provider as PaperProvider } from "react-native-paper";
import SideNavigation from "../components/SideNavigation";

const EditLesson = ({ navigation, route }) => {
  const { id } = route.params;
  console.log("Lesson Id: ", id);

  const [arquivo, setArquivo] = useState("Enviar arquivo");
  const [selectedValue, setSelectedValue] = useState();
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dificulty, setDificulty] = useState("");

  const [arrayList, setArrayList] = useState([]);
  const [music, setMusic] = useState([]);
  const [musicaId, setMusicaId] = useState();

  const getMusic = async () => {
    try {
      const response = await API.get(`${BASE_URL}/musicas`);
      setMusic(response.data);
      //console.log(response.data);
      console.log(music);
    } catch (err) {
      console.log("Get Musics Error ", err);
      returnError(err);
    }
  };

  const handleSelect = (value) => {
    setSelected(value);
    setMusicaId(value);
    closeMenu();
  };

  const getLesson = async () => {
    try {
      const response = await API.get(`${BASE_URL}/licoes/${id}`);
      //setMusic(response.data);
      //console.log(response.data);
      //Atribui o valor ao input Título
      setTitle(response.data.titulo);
      setInstructions(response.data.descricao);
      setSelectedValue(response.data.musica.id);
      setDificulty(response.data.dificuldade);

      console.log("getLesson: ", response.data);
    } catch (err) {
      console.log("Get Lesson Error ", err);
      returnError(err);
    }
  };

  const [visible, setVisible] = React.useState(false);
  const [selected, setSelected] = React.useState("Esolha uma música");

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const updateLesson = async () => {
    const data = {
      musicaId: selectedValue,
      titulo: title,
      descricao: instructions,
      dificuldade: dificulty,
    };
    console.log("Data: ", data);

    try {
      const response = await API.put(`${BASE_URL}/licoes/${id}`, data);
      console.log(response);
      Alert.alert("Alterações salvas com sucesso.");
      navigation.navigate("ListLessons");
    } catch (err) {
      console.log("Get Lesson Error ", err);
      returnError(err);
    }
  };

  useEffect(() => {
    getMusic();
    getLesson();
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <SideNavigation navigation={navigation} />

        <View style={styles.content}>
          <ScrollView>
            <Text style={styles.title}>Editar lição</Text>

            <Text style={styles.subtitle}>Título</Text>
            <TextInput
              text={title}
              onChangeText={(text) => setTitle(text)}
              value={title}
              style={[styles.input, { padding: 15 }]}
              placeholder="Digite o título da lição"
            />

            <Text style={styles.subtitle}>Instruções</Text>
            <TextInput
              text={instructions}
              onChangeText={(text) => setInstructions(text)}
              value={instructions}
              style={[styles.input, { padding: 15 }]}
              placeholder="Digite as instruções da lição"
            />

            <Text style={styles.subtitle}>Mùsica</Text>
            <Menu
              style={{ justifyContent: "flex-start" }}
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Button mode="outlined" onPress={openMenu}>
                  {selected}
                </Button>
              }
            >
              {music.map((song, index) => {
                return (
                  <Menu.Item
                    key={index}
                    onPress={() => handleSelect(song.id)}
                    title={song.nome}
                  />
                );
              })}
            </Menu>

            <Text style={styles.subtitle}>Nível de dificuldade</Text>

            <RadioButton.Group
              onValueChange={(newValue) => setDificulty(newValue)}
              value={dificulty}
              direction="row"
              flexDirection="row"
            >
              <View style={styles.radioRow}>
                <View style={styles.radioItem}>
                  <Text style={styles.radioText}>Fácil</Text>
                  <RadioButton color="#000" value="Fácil" />
                </View>
                <View style={styles.radioItem}>
                  <Text style={styles.radioText}>Médio</Text>
                  <RadioButton color="#000" value="Médio" />
                </View>
                <View style={styles.radioItem}>
                  <Text style={styles.radioText}>Difícil</Text>
                  <RadioButton color="#000" value="Difícil" />
                </View>
              </View>
            </RadioButton.Group>

            <TouchableOpacity onPress={updateLesson} style={styles.botaoLogin}>
              <Text style={styles.botaoTexto}>Salvar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: azulmedio,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  content: {
    width: "90%",
    maxWidth: 500,
    backgroundColor: branco,
    padding: 20,
    borderRadius: 10,
    shadowColor: preto,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: "90%",
    backgroundColor: branco,
    padding: 20,
    borderRadius: 10,
    shadowColor: preto,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    color: "#003366",
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    height: 50,
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 14,
    marginRight: 10,
  },

  searchInput: {
    height: 50,
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 14,
    marginRight: 10,
  },
  button: {
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  buttonText: {
    color: branco,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
  },
  createButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 12,
  },
  tableContainer: {
    width: "100%",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#cce5ff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerCell: {
    flex: 1,
    padding: 8,
    fontWeight: "bold",
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: "left",
  },
  link: {
    color: "#007bff",
  },

  botaoLogin: {
    backgroundColor: vermelho,
    paddingVertical: 5,
    marginTop: 5,
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
  radioRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  radioText: {
    color: "#000",
    fontSize: 16,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
});

export default EditLesson;
