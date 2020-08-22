import { setAccessToken } from "./../acessToken";
import axios from "axios";
import { MutationFunction, queryCache, useMutation } from "react-query";

interface User {
  email: string;
  password: string;
}
interface LoginUserResponse {
  error: boolean;
  success: boolean;
  loading: boolean;
  mutate: MutationFunction<any, User>;
}

export const useLoginUser = (): LoginUserResponse => {
  const loginUser = async (variables: User) => {
    const { data } = await axios.post("/users/login", variables);
    return data;
  };
  const [mutate, { isLoading, isError, isSuccess }] = useMutation(loginUser, {
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      queryCache.invalidateQueries("user");
    },
  });

  return {
    error: isError,
    success: isSuccess,
    loading: isLoading,
    mutate,
  };
};
