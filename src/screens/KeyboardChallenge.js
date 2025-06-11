import { Text, View } from "react-native";

function KeyboardChallenge({ navigation, route }) {
  const { id: musicaId } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Keyboard Challenge</Text>
      <Text>Test your keyboard skills!</Text>
    </View>
  );
}

export default KeyboardChallenge;
