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
import { azulmedio, branco, rosa, vermelho } from "../colors";
import * as ScreenOrientation from "expo-screen-orientation";
import { UserContext } from "../context/userContext";

function Cadastro({ navigation }) {
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [confirmarSenha, setConfirmarSenha] = useState("");
	const [loading, setLoading] = useState(false);
	const [msgError, setMsgError] = useState("");

	const { createUser } = useContext(UserContext);

	useEffect(() => {
		// Definir orientação como landscape (vertical) quando o componente for montado
		const setLandscapeOrientation = async () => {
			await ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.PORTRAIT_UP,
			);
		};

		setLandscapeOrientation();

		// Usar o evento de foco para garantir que a orientação seja sempre vertical
		// quando a tela Playlist estiver em foco
		const unsubscribe = navigation.addListener("focus", () => {
			setLandscapeOrientation();
		});

		return unsubscribe;
	}, [navigation]);

	useEffect(() => {
		setMsgError("");
	}, [email, senha, confirmarSenha, nome]);

	const handleCadastro = async () => {
		if (!nome || !email || !senha || !confirmarSenha) {
			setMsgError("Por favor, preencha todos os campos");
			return;
		}

		if (senha !== confirmarSenha) {
			setMsgError("As senhas não coincidem");
			return;
		}

		setLoading(true);

		try {
			const response = await createUser({
				nome,
				email,
				senha,
			});

			if (response) {
				Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
					{ text: "OK", onPress: () => navigation.navigate("Login") },
				]);
			}
		} catch (error) {
			setMsgError("Não foi possível realizar o cadastro. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container}>
				<View style={styles.cadastroBox}>
					<Text style={styles.title}>Cadastro</Text>

					<Text style={styles.label}>Nome</Text>
					<TextInput
						style={styles.input}
						placeholder="Digite seu nome"
						placeholderTextColor="rgba(0,0,0,0.5)"
						value={nome}
						onChangeText={setNome}
					/>

					<Text style={styles.label}>Email</Text>
					<TextInput
						style={styles.input}
						placeholder="Digite seu email"
						placeholderTextColor="rgba(0,0,0,0.5)"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>

					<Text style={styles.label}>Senha</Text>
					<TextInput
						style={styles.input}
						placeholder="Digite sua senha"
						placeholderTextColor="rgba(0,0,0,0.5)"
						value={senha}
						onChangeText={setSenha}
						secureTextEntry
					/>

					<Text style={styles.label}>Confirmar Senha</Text>
					<TextInput
						style={styles.input}
						placeholder="Confirme sua senha"
						placeholderTextColor="rgba(0,0,0,0.5)"
						value={confirmarSenha}
						onChangeText={setConfirmarSenha}
						secureTextEntry
					/>

					<Text style={styles.msgError}>{msgError}</Text>
					<TouchableOpacity
						style={styles.cadastroButton}
						onPress={handleCadastro}
						disabled={loading}
					>
						<Text style={styles.cadastroButtonText}>
							{loading ? "Cadastrando..." : "Cadastrar"}
						</Text>
					</TouchableOpacity>

					<View style={styles.loginContainer}>
						<Text style={styles.loginText}>Já possui uma conta?</Text>
						<TouchableOpacity onPress={() => navigation.navigate("Login")}>
							<Text style={styles.loginButton}>Faça login</Text>
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
	cadastroBox: {
		width: "100%",
		maxWidth: 350,
		backgroundColor: "rgba(0, 0, 150, 0.8)",
		borderRadius: 20,
		padding: 30,
		alignItems: "center",
		marginVertical: 40,
	},
	title: {
		fontSize: 36,
		fontWeight: "bold",
		color: branco,
		marginBottom: 30,
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
		height: 50,
		backgroundColor: branco,
		borderRadius: 10,
		marginBottom: 20,
		paddingHorizontal: 15,
		fontSize: 16,
	},
	cadastroButton: {
		width: "100%",
		height: 50,
		backgroundColor: rosa,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
	},
	cadastroButtonText: {
		color: branco,
		fontSize: 18,
		fontWeight: "bold",
	},
	loginContainer: {
		marginTop: 30,
		alignItems: "center",
	},
	loginText: {
		color: branco,
		fontSize: 14,
	},
	loginButton: {
		color: branco,
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 5,
	},
});

export default Cadastro;
