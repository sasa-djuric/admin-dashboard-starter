import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import api from './config/api';

type Response<T> = T;

interface Instance extends AxiosInstance {
	request<T = any, R = Response<T>>(config: AxiosRequestConfig): Promise<R>;
	get<T = any, R = Response<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
	delete<T = any, R = Response<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
	head<T = any, R = Response<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
	options<T = any, R = Response<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
	post<T = any, R = Response<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
	put<T = any, R = Response<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
	patch<T = any, R = Response<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
}

interface Config {
	baseURL: string;
	token: string | null;
}

const config: Config = {
	baseURL: api.baseURL,
	token: null
};

function _extendData(config: AxiosRequestConfig, extend: Object) {
	const data: any = config.data || {};

	Object.entries(extend).forEach(([key, value]) => {
		if (value) {
			data[key] = value;
		}
	});

	return {
		...config,
		data
	};
}

function _requestInterceptor(axiosConfig: AxiosRequestConfig) {
	if (config.token) {
		axiosConfig.headers.Authorization = `Bearer ${config.token}`;
	}

	return axiosConfig;
}

function _handleResponse(response: AxiosResponse<any>) {
	return response?.data;
}

function _handleError(error: any) {
	return Promise.reject(error?.response?.data);
}

function setToken(token: string) {
	config.token = token;
}

function removeToken() {
	config.token = null;
}

function setup() {
	const axios: Instance = Axios.create();

	axios.defaults.baseURL = config.baseURL;
	axios.interceptors.request.use(_requestInterceptor);
	axios.interceptors.response.use(_handleResponse, _handleError);

	return { ...axios, setToken, removeToken };
}

export default setup();
