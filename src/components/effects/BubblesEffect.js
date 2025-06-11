import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";

const { width, height } = Dimensions.get("window");

// Cores para as bolhas
const BUBBLE_COLORS = [
  "rgba(255, 183, 197, 0.7)", // Rosa
  "rgba(173, 216, 230, 0.7)", // Azul claro
  "rgba(152, 251, 152, 0.7)", // Verde claro
  "rgba(255, 255, 153, 0.7)", // Amarelo claro
  "rgba(221, 160, 221, 0.7)", // Lavanda
];

const BubblesEffect = ({ speed = 1, quantity = 30 }) => {
  const [bubbles, setBubbles] = useState([]);

  // Criar bolhas iniciais
  useEffect(() => {
    const bubblesArray = [];
    const bubbleCount = quantity;

    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 30 + 10;
      bubblesArray.push({
        id: i,
        x: Math.random() * width,
        y: height + size,
        size: size,
        color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
        speed: (Math.random() * 1.5 + 0.5) * speed,
        delay: Math.random() * 5000,
        position: new Animated.Value(0),
        scale: new Animated.Value(0.8 + Math.random() * 0.4),
      });
    }

    setBubbles(bubblesArray);

    // Iniciar a animação de flutuação para cada bolha
    const animations = bubblesArray.map((bubble) => {
      // Animação de movimento vertical
      const moveAnimation = Animated.timing(bubble.position, {
        toValue: 1,
        duration: (((height + bubble.size * 2) / bubble.speed) * 1000) / speed,
        delay: bubble.delay,
        useNativeDriver: true,
      });

      // Animação de escala (pulsar)
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bubble.scale, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(bubble.scale, {
            toValue: 0.9,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      // Iniciar animação de escala
      scaleAnimation.start();

      // Retornar animação de movimento para loop
      return Animated.loop(moveAnimation);
    });

    // Iniciar todas as animações de movimento
    animations.forEach((anim) => anim.start());

    // Limpar animações quando o componente for desmontado
    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, []);

  return (
    <View style={styles.container}>
      {bubbles.map((bubble) => {
        // Calcular a posição Y baseada na animação
        const translateY = bubble.position.interpolate({
          inputRange: [0, 1],
          outputRange: [bubble.y, -bubble.size * 2],
        });

        // Adicionar um leve movimento horizontal
        const translateX = bubble.position.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [
            bubble.x,
            bubble.x + 20 * Math.sin(bubble.id),
            bubble.x,
            bubble.x - 20 * Math.sin(bubble.id),
            bubble.x,
          ],
        });

        return (
          <Animated.View
            key={bubble.id}
            style={[
              styles.bubble,
              {
                width: bubble.size,
                height: bubble.size,
                backgroundColor: bubble.color,
                transform: [
                  { translateX },
                  { translateY },
                  { scale: bubble.scale },
                ],
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
  bubble: {
    position: "absolute",
    borderRadius: 100,
  },
});

export default BubblesEffect;
