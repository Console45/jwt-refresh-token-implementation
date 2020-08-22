import { setAccessToken } from "./../acessToken";
import axios from "axios";
import { MutationFunction, queryCache, useMutation } from "react-query";

interface LogoutUserResponse {
  error: boolean;
  success: boolean;
  loading: boolean;
  mutate: MutationFunction<any, any>;
}

export const useLogoutUser = (): LogoutUserResponse => {
  const logoutUser = async () => {
    const { data } = await axios.post("/user/me/logout");
    return data;
  };
  const [mutate, { isLoading, isError, isSuccess }] = useMutation(logoutUser, {
    onSuccess: () => {
      setAccessToken("");
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