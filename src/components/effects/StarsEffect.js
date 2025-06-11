import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";

const { width, height } = Dimensions.get("window");

const StarsEffect = ({ speed = 1, quantity = 40 }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starsArray = [];
    const starCount = quantity;

    for (let i = 0; i < starCount; i++) {
      starsArray.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 1,
        blinkDuration: (Math.random() * 1000 + 500) / speed,
        opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
      });
    }

    setStars(starsArray);

    // Iniciar a animação de brilho para cada estrela
    const animations = starsArray.map((star) => {
      return Animated.loop(
        Animated.sequence([
          // Aumentar brilho
          Animated.timing(star.opacity, {
            toValue: 1,
            duration: star.blinkDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // Diminuir brilho
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3 + 0.1, // Opacidade mínima entre 0.1 e 0.4
            duration: star.blinkDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
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
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              transform: [{ rotate: "45deg" }],
            },
          ]}
        />
      ))}
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
  star: {
    position: "absolute",
    backgroundColor: "#FFFF99",
    borderRadius: 1,
  },
});

export default StarsEffect;
