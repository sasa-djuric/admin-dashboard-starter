import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import api from './config/api';
import { ErrorCode } from './errors/enums';

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
	token?: string | null;
}

const config: Config = {
	baseURL: api.baseURL
};

const axios: Instance = Axios.create();

enum Event {
	Unauthorized = 'UNAUTHORIZED',
	TokenRefresh = 'TOKEN_REFRESH'
}

interface EventMap {
	[Event.Unauthorized]: (() => any) | null;
	[Event.TokenRefresh]: (() => any) | null;
}

const eventListeners: Record<Event, EventMap[Event]> = {
	[Event.Unauthorized]: null,
	[Event.TokenRefresh]: null
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

function _onUnauthorizedError(error: AxiosError) {
	const unauthorizedHandler = eventListeners[Event.Unauthorized];

	if (unauthorizedHandler) {
		return unauthorizedHandler();
	}

	return Promise.reject(error?.response?.data);
}

let lastTokenError: string | null;

async function _onTokenExpired(error: AxiosError) {
	try {
		const currentError = JSON.stringify(error);
		const refreshHandler = eventListeners[Event.TokenRefresh];

		if (lastTokenError === currentError || !refreshHandler) {
			throw new Error();
		}

		lastTokenError = currentError;

		if (refreshHandler) {
			setToken(await refreshHandler());

			const retryResponse = await axios.request(error.config);

			lastTokenError = null;

			return retryResponse;
		} else {
			throw new Error();
		}
	} catch (err) {
		return _onUnauthorizedError(error);
	}
}

async function _handleError(error: AxiosError) {
	if (error.response?.data?.code === ErrorCode.TokenExpired) {
		return _onTokenExpired(error);
	} else if (error.response?.status === 401) {
		return _onUnauthorizedError(error);
	}

	return Promise.reject(error?.response?.data);
}

function setToken(token: string) {
	config.token = token;
}

function removeToken() {
	config.token = null;
}

function addListener<T extends Event>(event: T, listener: EventMap[T]) {
	eventListeners[event] = listener;
}

axios.defaults.baseURL = config.baseURL;
axios.interceptors.request.use(_requestInterceptor);
axios.interceptors.response.use(_handleResponse, _handleError);

export default { ...axios, setToken, removeToken, addListener, Event };
