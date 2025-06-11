import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { azulmedio, branco, preto, rosa, roxo, vermelho } from "../colors";
import { getImages } from "../components/GetImages";
import { getIcones } from "../components/GetIcones";
import * as ScreenOrientation from "expo-screen-orientation";
import SideNavigation from "../components/SideNavigation";
import { UserContext } from "../context/userContext";

const EditarPerfil = ({ navigation }) => {
    const imagens = getImages();
    const icones = getIcones();
    const { user, updateUser } = useContext(UserContext);
    const [nome, setNome] = useState(user?.nome || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.img ?? 1);

    const avatares = [
        { id: 1, image: icones.perfil1 },
        { id: 2, image: icones.perfil2 },
        { id: 3, image: icones.perfil3 }
    ];

    const handleSalvar = async () => {
        try {
            await updateUser({
                nome: nome.trim(),
                img: selectedAvatar // Nome do campo que o backend espera
            });
            navigation.navigate('Perfil');
        } catch (error) {
            alert("Erro: " + error.message);
        }
    };
    useEffect(() => {
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
            );
        };

        lockOrientation();
        return navigation.addListener("focus", lockOrientation);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <SideNavigation navigation={navigation} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image
                    source={imagens.baloes}
                    style={styles.decoracaoBaloes}
                    resizeMode="contain"
                />
                <Image
                    source={imagens.bolhasduplas}
                    style={styles.bolhasDuplas}
                    resizeMode="contain"
                />
                <Image
                    source={imagens.borboleta}
                    style={styles.borboleta}
                    resizeMode="contain"
                />

                <View style={styles.conteudo}>
                    <Text style={styles.titulo}>Editar Perfil</Text>

                    <View style={styles.avatarContainer}>
                        {avatares.map((avatar) => (
                            <TouchableOpacity
                                key={avatar.id}
                                style={[
                                    styles.avatarWrapper,
                                    selectedAvatar === avatar.id && styles.avatarSelecionado
                                ]}
                                onPress={() => setSelectedAvatar(avatar.id)}
                            >
                                <Image
                                    source={avatar.image}
                                    style={[
                                        styles.avatarImage,
                                        selectedAvatar === avatar.id ? styles.quadrado : styles.redondo
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={styles.input}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Edite seu nome"
                        placeholderTextColor="#ccc"
                        autoCapitalize="words"
                        maxLength={30}
                    />

                    <TouchableOpacity
                        style={styles.botaoSalvar}
                        onPress={handleSalvar}
                    >
                        <Text style={styles.textoBotao}>Salvar Alterações</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: azulmedio,
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 30,
    },
    conteudo: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    titulo: {
        color: roxo,
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        alignSelf: "flex-start",
        left: 100 // Corrigido para número
    },
    avatarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 10,
    },
    avatarWrapper: {
        padding: 3,
        borderRadius: 1,
    },
    avatarSelecionado: {
        backgroundColor: branco,
        borderRadius: 0,
    },
    avatarImage: {
        width: 180,
        height: 171,
    },
    quadrado: {
        borderColor: branco,
        borderWidth: 2, // Adicionado
    },
    redondo: {
        borderRadius: 40,
    },
    input: {
        width: '40%', // Aumentado para melhor usabilidade
        height: 40,
        borderBottomWidth: 2,
        borderColor: preto,
        color: branco,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    botaoSalvar: {
        backgroundColor: rosa,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 8, // Adicionado borda arredondada
        elevation: 5,
        marginTop: 5,
    },
    textoBotao: {
        color: branco,
        fontSize: 15,
        fontWeight: 'bold',
    },
    decoracaoBaloes: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 120,
        height: 120,
        zIndex: -1,
    },
    bolhasDuplas: {
        position: "absolute",
        top: 20,
        left: 20,
        width: 100,
        height: 80,
    },
    borboleta: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 70,
        height: 70,
        zIndex: 0,
    },
});

export default EditarPerfil;