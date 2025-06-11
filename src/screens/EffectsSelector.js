import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { EffectsContext } from "../context/effectsContext";
import { azulmedio, branco, preto, rosa } from "../colors";
import * as ScreenOrientation from "expo-screen-orientation";

const EffectsSelector = ({ navigation }) => {
  const { availableEffects, saveEffect, currentEffect, clearEffect } =
    useContext(EffectsContext);

  // Configurar orientação para landscape
  React.useEffect(() => {
    const setLandscapeOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    setLandscapeOrientation();

    // Usar o evento de foco para garantir que a orientação seja sempre horizontal
    const unsubscribe = navigation.addListener("focus", () => {
      setLandscapeOrientation();
    });

    return unsubscribe;
  }, [navigation]);

  // Função para selecionar um efeito
  const handleSelectEffect = (effectId) => {
    saveEffect(effectId);
  };

  // Função para remover o efeito atual
  const handleClearEffect = () => {
    clearEffect();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Efeitos Especiais</Text>
      <Text style={styles.subtitle}>
        Selecione um efeito visual para personalizar sua experiência
      </Text>

      <ScrollView contentContainerStyle={styles.effectsContainer}>
        {availableEffects.map((effect) => (
          <TouchableOpacity
            key={effect.id}
            style={[
              styles.effectCard,
              currentEffect?.id === effect.id && styles.selectedCard,
            ]}
            onPress={() => handleSelectEffect(effect.id)}
          >
            <View style={styles.effectIconContainer}>
              {effect.id === "snow" && (
                <Text style={styles.effectIcon}>❄️</Text>
              )}
              {effect.id === "stars" && (
                <Text style={styles.effectIcon}>✨</Text>
              )}
              {effect.id === "bubbles" && (
                <Text style={styles.effectIcon}>🫧</Text>
              )}
            </View>
            <Text style={styles.effectName}>{effect.name}</Text>
            <Text style={styles.effectDescription}>{effect.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearEffect}
        >
          <Text style={styles.clearButtonText}>Remover Efeito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: azulmedio,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: branco,
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: branco,
    textAlign: "center",
    marginBottom: 30,
  },
  effectsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingBottom: 20,
  },
  effectCard: {
    width: 150,
    height: 180,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 15,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCard: {
    backgroundColor: rosa,
    borderWidth: 2,
    borderColor: branco,
  },
  effectIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  effectIcon: {
    fontSize: 30,
  },
  effectName: {
    fontSize: 16,
    fontWeight: "bold",
    color: branco,
    marginBottom: 5,
    textAlign: "center",
  },
  effectDescription: {
    fontSize: 12,
    color: branco,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  clearButtonText: {
    color: branco,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: rosa,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  backButtonText: {
    color: branco,
    fontWeight: "bold",
  },
});

export default EffectsSelector;
