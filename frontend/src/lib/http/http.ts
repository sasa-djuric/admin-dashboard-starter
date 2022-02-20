import { ErrorCode } from '@services/errors/enums';
import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type RefreshTokenHandler = () => Promise<string | undefined>;
type OnUnauthorized = () => void;

interface Options {
	baseURL?: string;
}

interface Config extends AxiosRequestConfig {}

interface RetryConfig extends Config {
	retry?: boolean;
}

class HTTP {
	private http: AxiosInstance;
	public token: string | null = null;
	public refreshTokenHandler: RefreshTokenHandler | undefined = undefined;
	public onUnauthorized: OnUnauthorized | undefined = undefined;

	constructor(options?: Options) {
		this.http = Axios.create({
			baseURL: options?.baseURL,
			withCredentials: process.env.NODE_ENV === 'development'
		});
		this.http.interceptors.request.use(this.requestInterceptor.bind(this));
		this.http.interceptors.response.use(
			this.handleResponse.bind(this),
			this.handleError.bind(this)
		);
	}

	public get<R = unknown>(url: string, config?: Config): Promise<R> {
		return this.http.get(url, config);
	}

	public post<R = unknown>(url: string, data?: unknown, config?: Config): Promise<R> {
		return this.http.post(url, data, config);
	}

	public put<R = unknown>(url: string, data?: unknown, config?: Config): Promise<R> {
		return this.http.put(url, data, config);
	}

	public patch<R = unknown>(url: string, data?: unknown, config?: Config): Promise<R> {
		return this.http.patch(url, data, config);
	}

	public delete<R = unknown>(url: string, config?: Config): Promise<R> {
		return this.http.delete(url, config);
	}

	private request<R = unknown>(config: RetryConfig): Promise<R> {
		return this.http.request(config);
	}

	private requestInterceptor(config: AxiosRequestConfig) {
		if (!config.headers) {
			config.headers = {};
		}

		if (this.token) {
			config.headers.Authorization = `Bearer ${this.token}`;
		}

		return config;
	}

	private handleResponse(response: AxiosResponse<unknown>) {
		return response?.data;
	}

	private async onTokenExpired(error: AxiosError & { config: { retry?: boolean } }) {
		try {
			if (error.config.retry || !this.refreshTokenHandler) {
				throw error;
			}

			const token = await this.refreshTokenHandler();

			if (token) {
				this.token = token;
			}

			const retryResponse = await this.request({
				...error.config,
				retry: true
			});

			return retryResponse;
		} catch (error: any) {
			this.onUnauthorized?.();
			return Promise.reject(error?.response?.data ?? error);
		}
	}

	private handleError(error: AxiosError) {
		if (error.response?.data?.code === ErrorCode.TokenExpired) {
			return this.onTokenExpired(error);
		} else if (error.response?.status === 401) {
			this.onUnauthorized?.();
		}

		return Promise.reject(error?.response?.data);
	}
}

export default HTTP;
