export const setAccessToken = (token: string) => {
    window.localStorage.setItem('accessToken', token);
};

export const setRefreshToken = (token: string) => {
    window.localStorage.setItem('refreshToken', token);
};
