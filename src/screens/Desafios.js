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
  Picker,
} from "react-native";
import { azulmedio, branco, preto } from "../colors";
import * as ScreenOrientation from "expo-screen-orientation";
import SideNavigation from "../components/SideNavigation";
import { getImages } from "../components/GetImages";
import { BASE_URL } from "../services/urls";
import API from "../services/api";
import { returnError } from "../services/error";

function Desafios({ navigation }) {
  const imagens = getImages();
  const [searchText, setSearchText] = useState("");
  const [desafiosData, setDesafiosData] = useState([]);
  const [musicasData, setMusicasData] = useState([]);
  const [updatedList, setUpdatedList] = useState(false);
  const [filtroAtual, setFiltroAtual] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newDesafio, setNewDesafio] = useState({
    titulo: "",
    descricao: "",
    dificuldade: "facil",
    musicaId: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Níveis de dificuldade disponíveis
  const nivelDificuldade = ["facil", "medio", "dificil"];

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
    const fetchDesafiosData = async () => {
      try {
        // Buscar a lista de desafios
        const desafiosResponse = await API.get(`${BASE_URL}/desafios`, {
          params: filtroAtual ? { dificuldade: filtroAtual } : {},
        });
        setDesafiosData(desafiosResponse.data);

        // Buscar a lista de músicas para o formulário
        const musicasResponse = await API.get(`${BASE_URL}/musicas`);
        setMusicasData(musicasResponse.data);
      } catch (err) {
        returnError(err);
      }
    };

    fetchDesafiosData();
  }, [updatedList, filtroAtual]);

  const handleCreate = () => {
    setNewDesafio({
      titulo: "",
      descricao: "",
      dificuldade: "facil",
      musicaId: musicasData.length > 0 ? musicasData[0].id : "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    // Validar dados obrigatórios
    if (!newDesafio.titulo || !newDesafio.descricao || !newDesafio.musicaId) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editingId) {
        // Atualizar desafio existente
        const response = await API.put(`${BASE_URL}/desafios/${editingId}`, {
          titulo: newDesafio.titulo,
          descricao: newDesafio.descricao,
          dificuldade: newDesafio.dificuldade,
        });

        if (response.status === 200) {
          Alert.alert("Sucesso", "Desafio atualizado com sucesso!");
          setEditingId(null);
          setShowForm(false);
          setUpdatedList(!updatedList);
        }
      } else {
        // Criar novo desafio
        const response = await API.post(`${BASE_URL}/desafios`, {
          titulo: newDesafio.titulo,
          descricao: newDesafio.descricao,
          dificuldade: newDesafio.dificuldade,
          musicaId: newDesafio.musicaId,
        });

        if (response.status === 201) {
          Alert.alert("Sucesso", "Desafio criado com sucesso!");
          setNewDesafio({
            titulo: "",
            descricao: "",
            dificuldade: "facil",
            musicaId: "",
          });
          setShowForm(false);
          setUpdatedList(!updatedList);
        }
      }
    } catch (err) {
      returnError(err);
      Alert.alert("Erro", "Não foi possível salvar o desafio");
    }
  };

  const handleEdit = (id) => {
    const desafioParaEditar = desafiosData.find((d) => d.id === id);
    if (desafioParaEditar) {
      setNewDesafio({
        titulo: desafioParaEditar.titulo,
        descricao: desafioParaEditar.descricao,
        dificuldade: desafioParaEditar.dificuldade,
        musicaId: desafioParaEditar.musicaId,
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await API.delete(`${BASE_URL}/desafios/${id}`);

      if (response.status === 200) {
        Alert.alert("Sucesso", "Desafio removido com sucesso!");
        setUpdatedList(!updatedList);
      }
    } catch (err) {
      returnError(err);
      Alert.alert("Erro", "Não foi possível remover o desafio");
    }
  };

  const handleFiltrar = (dificuldade) => {
    setFiltroAtual(dificuldade);
  };

  const renderDesafioItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.id}</Text>
      <Text style={styles.tableCell}>{item.titulo}</Text>
      <Text style={styles.tableCell}>{item.musica?.nome || "N/A"}</Text>
      <Text style={styles.tableCell}>{item.dificuldade}</Text>
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
      <Text style={styles.headerCell}>Título</Text>
      <Text style={styles.headerCell}>Música</Text>
      <Text style={styles.headerCell}>Dificuldade</Text>
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
          <Text style={styles.title}>Desafios</Text>

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Pesquisar desafio..."
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
              <Text style={styles.buttonText}>+ Criar Desafio</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filtrar por dificuldade:</Text>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filtroAtual === "" && styles.filterButtonActive,
              ]}
              onPress={() => handleFiltrar("")}
            >
              <Text style={styles.filterButtonText}>Todos</Text>
            </TouchableOpacity>
            {nivelDificuldade.map((nivel) => (
              <TouchableOpacity
                key={nivel}
                style={[
                  styles.filterButton,
                  filtroAtual === nivel && styles.filterButtonActive,
                ]}
                onPress={() => handleFiltrar(nivel)}
              >
                <Text style={styles.filterButtonText}>{nivel}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {showForm && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>
                {editingId ? "Editar Desafio" : "Criar Novo Desafio"}
              </Text>

              <TextInput
                placeholder="Título"
                value={newDesafio.titulo}
                onChangeText={(text) =>
                  setNewDesafio({ ...newDesafio, titulo: text })
                }
                style={styles.placeHolderInput}
              />

              <TextInput
                placeholder="Descrição"
                value={newDesafio.descricao}
                onChangeText={(text) =>
                  setNewDesafio({ ...newDesafio, descricao: text })
                }
                style={[
                  styles.placeHolderInput,
                  { height: 80, textAlignVertical: "top" },
                ]}
                multiline
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Dificuldade:</Text>
                <Picker
                  selectedValue={newDesafio.dificuldade}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setNewDesafio({ ...newDesafio, dificuldade: itemValue })
                  }
                >
                  {nivelDificuldade.map((nivel) => (
                    <Picker.Item key={nivel} label={nivel} value={nivel} />
                  ))}
                </Picker>
              </View>

              {!editingId && (
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Música:</Text>
                  <Picker
                    selectedValue={newDesafio.musicaId}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setNewDesafio({ ...newDesafio, musicaId: itemValue })
                    }
                  >
                    {musicasData.map((musica) => (
                      <Picker.Item
                        key={musica.id}
                        label={musica.nome}
                        value={musica.id}
                      />
                    ))}
                  </Picker>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>
                    {editingId ? "Atualizar" : "Salvar"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setNewDesafio({
                      titulo: "",
                      descricao: "",
                      dificuldade: "facil",
                      musicaId: "",
                    });
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={styles.subtitle}>Lista de Desafios</Text>

          <View style={styles.tableContainer}>
            {renderHeader()}
            <FlatList
              data={desafiosData}
              renderItem={renderDesafioItem}
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
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: branco,
    borderRadius: 5,
    padding: 8,
  },
  filterLabel: {
    color: "#003366",
    fontWeight: "bold",
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#ced4da",
  },
  filterButtonActive: {
    backgroundColor: "#007bff",
  },
  filterButtonText: {
    color: "#003366",
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: branco,
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 10,
  },
  placeHolderInput: {
    color: "rgba(0, 51, 102, 0.62)",
    fontWeight: "bold",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  pickerLabel: {
    color: "#003366",
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: branco,
    fontSize: 16,
    fontWeight: "bold",
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
  },
  createButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 12,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 20,
  },
  tableContainer: {
    backgroundColor: branco,
    width: "100%",
    marginTop: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#cce5ff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerCell: {
    flex: 1,
    padding: 10,
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
    padding: 10,
    textAlign: "left",
    color: "#007bff",
    fontWeight: "bold",
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

export default Desafios;
