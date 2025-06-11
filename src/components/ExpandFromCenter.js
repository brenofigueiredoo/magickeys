import React, { useEffect, useRef } from 'react';
import { View, Easing, Dimensions} from 'react-native';
import { Button, Animated, StyleSheet, Text, ActivityIndicator} from 'react-native';
import * as Colors from '../colors';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window'); // Get full screen dimensions


const ExpandFromCenter = () => {
  const animatedSize = useRef(new Animated.Value(0)).current; // Initial size
  const [fontsLoaded] = useFonts({
          'Chalk': require('../../../assets/fonts/Chalk-Regular.ttf')
      });

  const expand = () => {
    Animated.timing(animatedSize, {
      toValue: 1, // Scale factor
      duration: 3000, // Animation duration
      easing: Easing.out(Easing.ease), // Smooth easing
      useNativeDriver: false, // Required for layout animations
    }).start();
  };

  useEffect(() => {
      expand();
  
    }, []);
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View
        style={{
          width: animatedSize.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 320], // From 0 to full width
          }),
          height: animatedSize.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 120], // From 0 to full height
          }),
          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'center', // Center within the row
          alignItems: 'center', // Align text vertically
        }}
      >

        <Text style={{ fontFamily: 'Chalk', fontSize: 60, color: Colors.vermelho}}>
                    Magic
                </Text>
                <Text style={{ fontFamily: 'Chalk', fontSize: 60, color: Colors.creme}}>
                    Keys
                </Text>

      </Animated.View>
    </View>
  );
};

export default ExpandFromCenter;