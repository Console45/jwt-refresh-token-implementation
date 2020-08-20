let accessToken: string = "";

export const getAccessToken = (): string => {
  return accessToken;
};
export const setAccessToken = (token: string) => {
  accessToken = token;
};
