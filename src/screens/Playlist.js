import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { azulmedio, branco, preto } from "../colors";
import * as ScreenOrientation from "expo-screen-orientation";
import * as DocumentPicker from "expo-document-picker";
import SideNavigation from "../components/SideNavigation";
import { getImages } from "../components/GetImages";
import { BASE_URL } from "../services/urls";
import API from "../services/api";
import { returnError } from "../services/error";

function Playlist({ navigation }) {
  const imagens = getImages();
  const [searchText, setSearchText] = useState("");
  const [musicData, setMusicData] = useState([]);
  const [updatedList, setUpdatedList] = useState(false);
  const [isCreateMusic, setIsCreateMusic] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [newMusic, setNewMusic] = useState({
    nome: "",
    genero: "",
    duracao: "",
    midi: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const setLandscapeOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    setLandscapeOrientation();

    const unsubscribe = navigation.addListener("focus", () => {
      setLandscapeOrientation();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const fetchMusicData = async () => {
      const response = await API.get(`${BASE_URL}/musicas`)
        .then((res) => res.data)
        .catch((err) => {
          returnError(err);
        });

      setMusicData(response);
    };

    fetchMusicData();
  }, [updatedList]);

  const handleCreate = () => {
    setNewMusic({
      nome: "",
      genero: "",
      duracao: "",
      midi: null,
    });
    setEditingId(null);
    setShowForm(true);
    setIsCreateMusic(true);
  };

  const handleSave = async () => {
    if (editingId) {
      // Atualizar música existente
      const response = await API.put(`${BASE_URL}/musicas/${editingId}`, {
        nome: newMusic.nome,
        genero: newMusic.genero,
        duracao: newMusic.duracao,
      })
        .then((res) => res)
        .catch((err) => {
          returnError(err);
        });

      if (response.status === 200) {
        Alert.alert("Sucesso", "Música atualizada com sucesso!");
        setEditingId(null);
        setShowForm(false);
        setUpdatedList(!updatedList);
      } else {
        Alert.alert("Erro", "Não foi possível atualizar a música");
      }
    } else {
      // Criar nova música
      const formData = new FormData();

      formData.append("arquivo", newMusic.midi.file);
      formData.append("nome", newMusic.nome);
      formData.append("genero", newMusic.genero);
      formData.append("duracao", newMusic.duracao);

      const response = await API.post(`${BASE_URL}/musicas`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => res)
        .catch((err) => {
          returnError(err);
        });

      if (response.status === 201) {
        Alert.alert("Sucesso", "Música enviada com sucesso!");
        setNewMusic({
          nome: "",
          genero: "",
          duracao: "",
          midi: null,
        });
        setEditingId(null);
        setShowForm(false);
        setUpdatedList(!updatedList);
      } else {
        Alert.alert("Erro", "Não foi possível enviar a música");
      }
    }
  };

  const handleEdit = (id) => {
    const musicaParaEditar = musicData.find((m) => m.id === id);
    if (musicaParaEditar) {
      setNewMusic({ ...musicaParaEditar, midi: null }); // você pode manter o midi original se quiser
      setEditingId(id);
      setShowForm(true);
      setIsCreateMusic(false);
    }
  };

  const handleDelete = async (id) => {
    const response = await API.delete(`${BASE_URL}/musicas/${id}`)
      .then((res) => res)
      .catch((err) => {
        returnError(err);
      });

    if (response.status === 200) {
      Alert.alert("Sucesso", "Música deletada com sucesso!");
      setUpdatedList(!updatedList);
    } else {
      Alert.alert("Erro", "Não foi possível atualizar a música");
    }
    // setMusicData(musicData.filter((item) => item.id !== id));
  };

  const pickMidiFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setNewMusic({ ...newMusic, midi: file });
      }
    } catch (error) {
      console.error("Erro ao escolher arquivo .mid:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.id}</Text>
      <TouchableOpacity>
        <Text style={[styles.tableCell, styles.link]}>{item.nome}</Text>
      </TouchableOpacity>
      <Text style={styles.tableCell}>{item.genero}</Text>
      <Text style={styles.tableCell}>{item.duracao}</Text>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => handleEdit(item.id)}
          style={[styles.button, { backgroundColor: "#ffc107" }]}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[styles.button, { backgroundColor: "#dc3545", marginLeft: 4 }]}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>ID</Text>
      <Text style={styles.headerCell}>Nome</Text>
      <Text style={styles.headerCell}>Gênero</Text>
      <Text style={styles.headerCell}>Duração</Text>
      <Text style={styles.headerCell}>Ações</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SideNavigation navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={imagens.notasmusicais}
          style={styles.notasMusicais}
          resizeMode="contain"
        />
        <View style={styles.content}>
          <Text style={styles.title}>Playlist</Text>

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
              style={[styles.button, styles.createButton]}
              onPress={handleCreate}
            >
              <Text style={styles.buttonText}>+ Criar</Text>
            </TouchableOpacity>
          </View>

          {showForm && (
            <View>
              <TextInput
                placeholder="Nome"
                value={newMusic.nome}
                onChangeText={(text) =>
                  setNewMusic({ ...newMusic, nome: text })
                }
                style={styles.placeHolderInput}
              />
              <TextInput
                placeholder="Gênero"
                value={newMusic.genero}
                onChangeText={(text) =>
                  setNewMusic({ ...newMusic, genero: text })
                }
                style={styles.placeHolderInput}
              />
              <TextInput
                placeholder="Duração (mm:ss)"
                value={newMusic.duracao}
                onChangeText={(text) =>
                  setNewMusic({ ...newMusic, duracao: text })
                }
                style={styles.placeHolderInput}
              />

              {isCreateMusic && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: "#17a2b8", marginTop: 10 },
                  ]}
                  onPress={pickMidiFile}
                >
                  <Text style={styles.buttonText}>
                    {newMusic.midi
                      ? "🎵 Arquivo selecionado"
                      : "📁 Selecionar .mid"}
                  </Text>
                </TouchableOpacity>
              )}

              {newMusic.midi && (
                <Text
                  style={{ color: "#003366", fontWeight: "bold", marginTop: 5 }}
                >
                  Arquivo: {newMusic.midi.name}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.button, styles.createButton, { marginTop: 10 }]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>
                  {editingId ? "Atualizar" : "Salvar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.createButton,
                  { marginTop: 10, backgroundColor: "#dc3545" },
                ]}
                onPress={() => {
                  setNewMusic({
                    nome: "",
                    genero: "",
                    duracao: "",
                    midi: null,
                  });
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.subtitle}>Músicas</Text>

          <View style={styles.tableContainer}>
            {renderHeader()}
            <FlatList
              data={musicData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: azulmedio,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "78%",
    backgroundColor: "#14b8b8",
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
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#003366",
    alignSelf: "center",
  },
  searchContainer: {
    borderRadius: 5,
    backgroundColor: branco,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    color: "#003366",
    fontWeight: "bold",
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 18,
    marginRight: 10,
  },
  placeHolderInput: {
    color: "rgba(0, 51, 102, 0.62)",
    fontWeight: "bold",
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 18,
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
    backgroundColor: branco,
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
    color: "#003366",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: "left",
    color: "#007bff",
    fontWeight: "bold",
    width: 200,
  },
  link: {
    color: "#007bff",
  },
  notasMusicais: {
    position: "absolute",
    alignSelf: "flex-start",
    bottom: 20,
    width: 120,
    height: 120,
    zIndex: 11,
    left: -17,
  },
});

export default Playlist;
