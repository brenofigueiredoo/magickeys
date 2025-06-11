import {Button} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import * as Colors from '../colors';


//const color = Colors.roxo;

export function HorizontalButton({text, color}){
    return(
        <View>
        <Button style={[styles.button, {backgroundColor: color}]} mode="contained" onPress={() => console.log("Pressed me")}>
            {text}
        </Button>
        </View>
    )
};


const styles = StyleSheet.create({

  container: {



  },

  button:{
    
    marginTop:15,
    backgroundColor: Colors.vermelho,
    padding:15,
    fontSize:30,
    width:'210'
  }


});

