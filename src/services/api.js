import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const onRequest = async (config) => {
	const token = await AsyncStorage.getItem("@TOKEN");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
};

const setupIntercptorsTO = (axiosInstance) => {
	axiosInstance.interceptors.request.use(onRequest);
	return axiosInstance;
};

const API = axios.create();
setupIntercptorsTO(API);

export default API;
