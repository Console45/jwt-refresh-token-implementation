import axios from "axios";

interface NewUser {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  data?: any;
  accessToken?: string;
  error?: any;
  register: boolean;
}
type CreateUser = (newUser: NewUser) => Promise<CreateUserResponse>;

export const useCreateUser = (): CreateUser => {
  const createUser: CreateUser = async (newUser) => {
    try {
      const res = await axios.post("/users", newUser);
      return {
        data: res.data.user,
        register: res.data.register,
        accessToken: res.data.accessToken,
      };
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data.error,
          register: error.response.data.register,
        };
      }
      return {
        error: error.message,
        register: false,
      };
    }
  };
  return createUser;
};
