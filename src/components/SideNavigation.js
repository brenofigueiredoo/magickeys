import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { getIcones } from "./GetIcones";
import { getImages } from "./GetImages";

function SideNavigation({ navigation }) {
	const icones = getIcones();
	const imagens = getImages();

	return (
		<View style={styles.sideNavContainer}>
			<Image
				source={imagens.sidebartransparente}
				style={styles.sidebarBackground}
				resizeMode="stretch"
			/>

			<TouchableOpacity
				style={styles.navButton}
				onPress={() => navigation.navigate("Home")}
			>
				<Image
					source={icones.casa}
					style={styles.navIcon}
					resizeMode="contain"
				/>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.navButton}
				onPress={() => navigation.navigate("Splash")}
			>
				<Image
					source={icones.quadrado}
					style={styles.navIcon}
					resizeMode="contain"
				/>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.navButton}
				onPress={() => navigation.goBack()}
			>
				<Image
					source={icones.voltar}
					style={styles.navIcon}
					resizeMode="contain"
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	sideNavContainer: {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		width: 80,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 10,
		gap: 10,
	},
	sidebarBackground: {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		width: 80,
		height: "100%",
	},
	navButton: {
		width: 60,
		height: 60,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 15,
	},
	navIcon: {
		width: 50,
		height: 50,
	},
});

export default SideNavigation;
