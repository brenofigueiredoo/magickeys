import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";

const { width, height } = Dimensions.get("window");

const SnowEffect = ({ speed = 1, quantity = 50 }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = [];
    const flakeCount = quantity;

    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height * -1,
        size: Math.random() * 8 + 2,
        speed: (Math.random() * 2 + 1) * speed,
        opacity: new Animated.Value(0),
        position: new Animated.Value(0),
      });

      // Animar a opacidade para fade in
      Animated.timing(flakes[i].opacity, {
        toValue: Math.random() * 0.5 + 0.3,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }

    setSnowflakes(flakes);

    // Iniciar a animação de queda
    const animations = flakes.map((flake) => {
      return Animated.loop(
        Animated.timing(flake.position, {
          toValue: 1,
          duration: (height / flake.speed) * 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
    });

    // Iniciar todas as animações
    animations.forEach((anim) => anim.start());

    // Limpar animações quando o componente for desmontado
    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, []);

  return (
    <View style={styles.container}>
      {snowflakes.map((flake) => {
        // Calcular a posição Y baseada na animação
        const translateY = flake.position.interpolate({
          inputRange: [0, 1],
          outputRange: [flake.y, height + flake.size],
        });

        // Adicionar um leve movimento horizontal
        const translateX = flake.position.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [
            flake.x,
            flake.x + 15 * Math.sin(flake.id),
            flake.x,
            flake.x - 15 * Math.sin(flake.id),
            flake.x,
          ],
        });

        return (
          <Animated.View
            key={flake.id}
            style={[
              styles.snowflake,
              {
                width: flake.size,
                height: flake.size,
                borderRadius: flake.size / 2,
                opacity: flake.opacity,
                transform: [{ translateX }, { translateY }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
    pointerEvents: "none",
  },
  snowflake: {
    position: "absolute",
    backgroundColor: "white",
  },
});

export default SnowEffect;
