import axios from "axios";

interface User {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  data?: any;
  accessToken?: string;
  error?: any;
  login: boolean;
}
type LoginUser = (user: User) => Promise<LoginUserResponse>;

export const useLoginUser = (): LoginUser => {
  const loginUser: LoginUser = async (user: User) => {
    try {
      const res = await axios.post("/users/login", user);
      return {
        data: res.data.user,
        accessToken: res.data.accessToken,
        login: res.data.login,
      };
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data.error,
          login: error.response.data.login,
        };
      }
      return {
        error: error.message,
        login: false,
      };
    }
  };
  return loginUser;
};
