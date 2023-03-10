export const setAccessToken = (token: string) => {
    window.localStorage.setItem('accessToken', token);
};

export const setRefreshToken = (token: string) => {
    window.localStorage.setItem('refreshToken', token);
};

export const getAccessToken = () => {
    return window.localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
    return window.localStorage.getItem('refreshToken');
};

export const removeTokens = () => {
    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('accessToken');
}