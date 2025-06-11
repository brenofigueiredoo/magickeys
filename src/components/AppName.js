import { Button, Animated, View, StyleSheet, Text, ActivityIndicator, Easing, Dimensions } from 'react-native';
import * as Colors from '../colors';
import { useFonts } from 'expo-font';
import React, { useEffect, useRef } from 'react';

const { width, height } = Dimensions.get('window'); // Get full screen dimensions

const AppName =()=>{

    const [fontsLoaded] = useFonts({
        'Chalk': require('../../../assets/fonts/Chalk-Regular.ttf')
    });

    const animatedSize = useRef(new Animated.Value(0)).current; // Initial size

  const expand = () => {
    Animated.timing(animatedSize, {
      toValue: 1, // Scale factor
      duration: 1000, // Animation duration
      easing: Easing.out(Easing.ease), // Smooth easing
      useNativeDriver: false, // Required for layout animations
    }).start();
  };



useEffect(() => {

  expand();
    
  }, []);
   
    return (

    <Animated.View style={{
      flex: 1, justifyContent:'center',alignItems: 'center', flexDirection: 'row',
      width: animatedSize.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width], // From 0 to full width
      }),
      height: animatedSize.interpolate({
        inputRange: [0, 1],
        outputRange: [0, height], // From 0 to full height
      }),
    }}>

        <Text style={{ fontFamily: 'Chalk', fontSize: 60, color: Colors.vermelho}}>
            Magic
        </Text>
        <Text style={{ fontFamily: 'Chalk', fontSize: 60, color: Colors.creme}}>
            Keys
        </Text>
        <Button title="Expand" onPress={expand} />
    </Animated.View>
    
    

    )

};


export default AppName;

const styles = StyleSheet.create({

   container:{
       flexDirection: 'row', 


   },


});