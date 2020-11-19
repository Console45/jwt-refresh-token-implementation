import { useHistory } from "react-router-dom";
import { setAccessToken } from "../../acessToken";
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
  const { push } = useHistory();
  const loginUser = async (variables: User) => {
    const { data } = await axios.post("/user/login", variables);
    return data;
  };
  const [mutate, { isLoading, isError, isSuccess }] = useMutation(loginUser, {
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      queryCache.invalidateQueries("user");
      push("/user");
    },
  });

  return {
    error: isError,
    success: isSuccess,
    loading: isLoading,
    mutate,
  };
};
