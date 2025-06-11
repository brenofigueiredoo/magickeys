import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Alert,
	ScrollView,
} from "react-native";
import { azulmedio, branco, vermelho } from "../colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from "expo-screen-orientation";
import { UserContext } from "../context/userContext";

function Login({ navigation }) {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [loading, setLoading] = useState(false);
	const [msgError, setMsgError] = useState("");

	const { userLogin } = useContext(UserContext);

	useEffect(() => {
		// Definir orientação como portrait (vertical) quando o componente for montado
		const setPortraitOrientation = async () => {
			await ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.PORTRAIT_UP,
			);
		};

		setPortraitOrientation();

		// Restaurar orientação landscape quando o componente for desmontado
		return () => {
			ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
		};
	}, []);

	useEffect(() => {
		setMsgError("");
	}, [email, senha]);

	const handleLogin = async () => {
		if (!email || !senha) {
			setMsgError("Por favor, preencha todos os campos");
			return;
		}

		setLoading(true);

		try {
			const response = await userLogin({
				email,
				senha,
			});

			if (response.token) {
				await AsyncStorage.setItem("@TOKEN", response.token);
				navigation.navigate("Home");
			}
		} catch (error) {
			setMsgError("Email ou senha inválidos");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container}>
				<View style={styles.loginBox}>
					<Text style={styles.title}>Login</Text>

					<Text style={styles.label}>Usuário</Text>
					<TextInput
						style={styles.input}
						placeholder="Digite seu email"
						placeholderTextColor="rgba(255,255,255,0.7)"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>

					<Text style={styles.label}>Senha</Text>
					<TextInput
						style={styles.input}
						placeholder="Digite sua senha"
						placeholderTextColor="rgba(255,255,255,0.7)"
						value={senha}
						onChangeText={setSenha}
						secureTextEntry
					/>

					<Text style={styles.msgError}>{msgError}</Text>
					<TouchableOpacity
						style={styles.loginButton}
						onPress={handleLogin}
						disabled={loading}
					>
						<Text style={styles.loginButtonText}>
							{loading ? "Carregando..." : "Entrar"}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity>
						<Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
					</TouchableOpacity>

					<View style={styles.registerContainer}>
						<Text style={styles.registerText}>Não possui uma conta?</Text>
						<TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
							<Text style={styles.registerButton}>Cadastre-se</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
	},
	container: {
		flex: 1,
		backgroundColor: azulmedio,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	loginBox: {
		width: "100%",
		maxWidth: 350,
		backgroundColor: "rgba(0, 0, 150, 0.8)",
		borderRadius: 20,
		padding: 25,
		alignItems: "center",
		marginVertical: 30,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: branco,
		marginBottom: 25,
	},
	label: {
		alignSelf: "flex-start",
		color: branco,
		fontSize: 16,
		marginBottom: 5,
	},
	msgError: {
		alignSelf: "flex-start",
		color: vermelho,
		fontSize: 16,
		marginBottom: 5,
	},
	input: {
		width: "100%",
		height: 45,
		backgroundColor: branco,
		borderRadius: 10,
		marginBottom: 15,
		paddingHorizontal: 15,
		fontSize: 16,
	},
	loginButton: {
		width: "100%",
		height: 45,
		backgroundColor: "#00cc00",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
	},
	loginButtonText: {
		color: branco,
		fontSize: 18,
		fontWeight: "bold",
	},
	forgotPassword: {
		color: branco,
		marginTop: 15,
		fontSize: 14,
	},
	registerContainer: {
		marginTop: 30,
		alignItems: "center",
	},
	registerText: {
		color: branco,
		fontSize: 14,
	},
	registerButton: {
		color: branco,
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 5,
	},
});

export default Login;
