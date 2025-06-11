import React, { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  Alert,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { azulmedio, branco, preto, vermelho } from "../colors";
import * as DocumentPicker from "expo-document-picker";
import { RadioButton } from "react-native-paper";
import API from "../services/api";
import { BASE_URL } from "../services/urls";
import { returnError } from "../services/error";
import SideNavigation from "../components/SideNavigation";
import { Menu, Button, Provider as PaperProvider } from "react-native-paper";

const CreateLesson = ({ navigation }) => {
  const [arquivo, setArquivo] = useState("Enviar arquivo");
  const [selectedValue, setSelectedValue] = useState("Option1");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dificulty, setDificulty] = useState("");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Fácil", value: "f" },
    { label: "Médio", value: "m" },
    { label: "Difícil", value: "d" },
  ]);

  const criarLicao2 = async () => {
    try {
      const formData = new FormData();
      const newData = {
        titulo: title,
        descricao: instructions,
        musicaId: arquivo,
        dificuldade: "1",
      };

      formData.append("data", JSON.stringify(newData));
      console.log(JSON.stringify(newData));
      //console.log(JSON.stringify(newData));

      // Step 3: Upload using fetch
      const response = await fetch("http://192.168.0.9:8000/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      const responseJson = await response.json();
      console.log("Upload success:", responseJson);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  const [music, setMusic] = useState([]);

  const createLessonProgress = async (data) => {
    try {
      const response = await API.post(`${BASE_URL}/progresso_licoes`, data);
      console.log("Create progress ", response.data);
      setProgressId(response.data.id);
      console.log("Response data id: ", response.data.id);
      return response.data;
    } catch (err) {
      console.log("Create lesson error ", err);
      returnError(err);
    }
  };

  const getMusic = async () => {
    try {
      const response = await API.get(`${BASE_URL}/musicas`);
      setMusic(response.data);
    } catch (err) {
      console.log("Get Musics Error ", err);
      returnError(err);
    }
  };

  const [arrayList, setArrayList] = useState([]);
  var newArray = [];

  const updateList = () => {
    fetch(
      "http://atendimento.caed.ufmg.br:8000/ebooker/magickeys/getmidilist.php",
      {
        method: "GET",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text(); // or response.json() if it's a JSON file
      })
      .then((data) => {
        const dataArray = JSON.parse(data);
        //console.log(dataArray);
        //console.log(Object.keys(dataArray));

        setArrayList(dataArray);

        //console.log('Fetched file content:', data);
      })
      .catch((error) => {
        console.error("Error fetching file:", error);
      });
  };

  const createArray = () => {
    //console.log("Music: ", music);

    try {
      //const newArray = [];

      music.forEach((element) => {
        var arr = { label: element.nome, value: element.id };
        newArray.push(arr);
      });
      //console.log("New array: ", newArray);
      console.log("New array: ", newArray);
      setMusic(newArray);
      //return newArray;
      //console.log("Music: ", music);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    updateList();
    getMusic();
    createArray();
    setMusic(newArray);
  }, []);
  const [visible, setVisible] = React.useState(false);
  const [selected, setSelected] = React.useState("Esolha uma música");

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (value) => {
    setSelected(value);
    setMusicaId(value);
    closeMenu();
  };

  const [musicaId, setMusicaId] = useState();

  const createNewLesson = async () => {
    const data = {
      musicaId: musicaId,
      titulo: title,
      descricao: instructions,
      dificuldade: dificulty,
    };

    try {
      const response = await API.post(`${BASE_URL}/licoes`, data);
      console.log("Create lesson ", response.data);
      Alert.alert("Lição criada com sucesso.");
      return response.data;
    } catch (err) {
      console.log("Create lesson error ", err);
      returnError(err);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <SideNavigation navigation={navigation} />

        <View style={styles.content}>
          <ScrollView>
            <Text style={styles.title}>Criar lição</Text>

            <Text style={styles.subtitle}>Título</Text>

            <TextInput
              text={title}
              onChangeText={(text) => setTitle(text)}
              style={[styles.input, { padding: 15 }]}
              placeholder="Digite o título da lição"
            />

            <Text style={styles.subtitle}>Música</Text>
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
            <Text style={styles.subtitle}>Instruções</Text>
            <TextInput
              text={instructions}
              onChangeText={(text) => setInstructions(text)}
              style={[styles.input, { padding: 15 }]}
              placeholder="Digite as instruções da lição"
            />

            <Text style={styles.subtitle}>Nível de dificuldade</Text>

            <RadioButton.Group
              onValueChange={(newValue) => setDificulty(newValue)}
              value={dificulty}
              direction="row"
              flexDirection="row"
            >
              <View style={styles.radioRow}>
                <View style={styles.radioItem}>
                  <Text>Fácil</Text>
                  <RadioButton layout={"row"} value="Fácil" />
                </View>
                <View style={styles.radioItem}>
                  <Text>Médio</Text>
                  <RadioButton layout={"row"} value="Médio" />
                </View>
                <View style={styles.radioItem}>
                  <Text>Difícil</Text>
                  <RadioButton layout={"row"} value="Difícil" />
                </View>
              </View>
            </RadioButton.Group>

            <TouchableOpacity
              onPress={createNewLesson}
              style={styles.botaoLogin}
            >
              <Text style={styles.botaoTexto}>Criar</Text>
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
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  radioText: {
    color: "#000",
    fontSize: 16,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
});

export default CreateLesson;
