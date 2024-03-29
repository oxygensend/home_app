import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../tokenStorage';

const instance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (err.response) {
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const response = await axios.post(
                        '/api/refresh_token',
                        {
                            token: getRefreshToken(),
                        },
                        {
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                        },
                    );
                    const { accessToken, refreshToken } = response.data;
                    setAccessToken(accessToken);
                    setRefreshToken(refreshToken);
                    instance.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                    return instance(originalConfig);
                } catch (e: any) {
                    if (e.response && e.response.data) {
                        return Promise.reject(e.response.data);
                    }

                    return Promise.reject(e);
                }
            }

            if (err.response.status === 403 && err.response.data) {
                return Promise.reject(err.response.data);
            }
        }
        return Promise.reject(err);
    },
);

export default instance;
