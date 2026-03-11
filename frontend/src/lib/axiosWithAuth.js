import axios from "axios";

export const createAxiosWithAuth = (getToken) => {
  const instance = axios.create({
    baseURL: "http://localhost:8000/api",
  });

  instance.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return instance;
};