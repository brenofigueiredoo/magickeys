import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { azulmedio, branco, preto, vermelho } from "../colors";
import API from "../services/api";
import { BASE_URL } from "../services/urls";
import { returnError } from "../services/error";
import SideNavigation from "../components/SideNavigation";

const ListLessons = ({ navigation }) => {
  const [arrayList, setArrayList] = useState("");
  const [searchText, setSearchText] = useState("");

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.id}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditLesson", {
            id: item.id,
          })
        }
      >
        <Text style={[styles.tableCell, styles.link]}>{item.titulo}</Text>
      </TouchableOpacity>
      <Text style={styles.tableCell}>{item.descricao}</Text>
      <Text style={styles.tableCell}>{item.musica.nome}</Text>
      <Text style={styles.tableCell}>{item.dificuldade}</Text>
      <TouchableOpacity onPress={() => showConfirmAlert(item.id)}>
        <Image
          source={require("../../assets/icones/bin.png")}
          style={{ width: 24, height: 24 }}
          mode="contain"
        />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>ID</Text>
      <Text style={styles.headerCell}>Título</Text>
      <Text style={styles.headerCell}>Descrição</Text>
      <Text style={styles.headerCell}>Música</Text>
      <Text style={styles.headerCell}>Dificuldade</Text>
      <Text style={styles.headerCell}>Excluir</Text>
    </View>
  );

  const showConfirmAlert = (id) => {
    Alert.alert(
      "Confirmar ação",
      "Tem certeza que deseja deletar a lição?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed", id),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteLessson(id),
        },
      ],
      { cancelable: false }
    );
  };

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

  const coresDesafios = [
    "#E74C3C", // vermelho
    "#16A085", // verde
    "#2980B9", // azul
    "#D81B60", // rosa
    "#9B59B6", // roxo
  ];

  const deleteLessson = (id) => {
    fetch(`http://150.164.41.48:8000/lessons/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text(); // or response.json() if it's a JSON file
      })
      .then((data) => {
        //const dataArray = JSON.parse(data);
        //setArrayList(dataArray);
        updateList();
        console.log("Fetched file content:", data);
      })
      .catch((error) => {
        console.error("Error fetching file:", error);
      });
  };

  useEffect(() => {
    updateList();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <SideNavigation navigation={navigation} />
      <View style={styles.content}>
        <ScrollView>
          <Text style={styles.title}>Lições disponíveis</Text>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Pesquisar música..."
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={[styles.button, styles.searchButton]}>
              <Text style={styles.buttonText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateLesson")}
              style={[styles.button, styles.createButton]}
            >
              <Text style={styles.buttonText}>+ Criar</Text>
            </TouchableOpacity>
          </View>
          {renderHeader()}
          <View style={styles.tableContainer}>
            <FlatList
              data={arrayList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default ListLessons;

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
    width: "120",
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
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
});
