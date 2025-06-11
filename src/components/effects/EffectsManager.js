import React, { useContext } from "react";
import { View } from "react-native";
import { EffectsContext } from "../../context/effectsContext";

// Importar os efeitos
import SnowEffect from "./SnowEffect";
import StarsEffect from "./StarsEffect";
import BubblesEffect from "./BubblesEffect";

const EffectsManager = () => {
  const { currentEffect } = useContext(EffectsContext);

  if (!currentEffect) return null;

  // Renderizar o efeito apropriado com base no ID do efeito atual
  const renderEffect = () => {
    switch (currentEffect.id) {
      case "snow":
        return (
          <SnowEffect
            speed={currentEffect.speed}
            quantity={currentEffect.quantity}
          />
        );
      case "stars":
        return (
          <StarsEffect
            speed={currentEffect.speed}
            quantity={currentEffect.quantity}
          />
        );
      case "bubbles":
        return (
          <BubblesEffect
            speed={currentEffect.speed}
            quantity={currentEffect.quantity}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ position: "absolute", width: "100%", height: "100%" }}>
      {renderEffect()}
    </View>
  );
};

export default EffectsManager;
