import axios, { AxiosInstance } from "axios";

export const baseApi = axios.create({
    baseURL: process.env.BACKEND_URL,
});

export function createAuthenticatedRequest(token: string): AxiosInstance {
    return axios.create({
        baseURL: process.env.BACKEND_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
