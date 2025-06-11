import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../screens/Splash";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Home from "../screens/Home";
import Playlist from "../screens/Playlist";
import Perfil from "../screens/Perfil";
import Lessons from "../screens/Lessons";
import MusicPlayer from "../screens/MusicPlayer";
import LessonsPlaylist from "../screens/LessonsPlaylist";
import CreateLesson from "../screens/CreateLesson";
import ListLessons from "../screens/ListLessons";
import EditLesson from "../screens/EditLesson";
import VirtualKeyboard from "../screens/VirtualKeyboard";
import AuthRoute from "./AuthRoute";
import MyChallenges from "../screens/MyChallenges";
import TocarDesafio from "../screens/TocarDesafio";
import MyLessons from "../screens/MyLessons";
import EditarPerfil from "../screens/EditarPerfil";
import ListaMusicas from "../screens/ListaMusicas";
import Desafios from "../screens/Desafios";
import AuthAdminRoute from "./AuthAdminRoute";
import Favoritas from "../screens/Favoritas";
import Admin from "../screens/Admin";
import ListChallenges from "../screens/ListChallenges";
import KeyboardChallenge from "../screens/KeyboardChallenge";
import TocarMusica from "../screens/TocarMusica";
import EffectsSelector from "../screens/EffectsSelector";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <Home {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Playlist" options={{ headerShown: false }}>
          {(props) => (
            <AuthAdminRoute navigation={props.navigation}>
              <Playlist {...props} />
            </AuthAdminRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Perfil" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <Perfil {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="MyChallenges" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <MyChallenges {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="MyLessons" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <MyLessons {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="EditarPerfil" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <EditarPerfil {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Desafios" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <Desafios {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Lições" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <Lessons {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="KeyboardChallenge" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <KeyboardChallenge {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="LessonsPlaylist" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <LessonsPlaylist {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="ListChallenges" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <ListChallenges {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="TocarDesafio" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <TocarDesafio {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Piano" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <VirtualKeyboard {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="CreateLesson" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <CreateLesson {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="MusicPlayer" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <MusicPlayer {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="TocarMusica" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <TocarMusica {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="ListLessons" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <ListLessons {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="EditLesson" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <EditLesson {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="ListaMusicas" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <ListaMusicas {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Favoritas" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <Favoritas {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="EffectsSelector" options={{ headerShown: false }}>
          {(props) => (
            <AuthRoute navigation={props.navigation}>
              <EffectsSelector {...props} />
            </AuthRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Admin" options={{ headerShown: false }}>
          {(props) => (
            <AuthAdminRoute navigation={props.navigation}>
              <Admin {...props} />
            </AuthAdminRoute>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
