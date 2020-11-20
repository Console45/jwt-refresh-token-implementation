import { useHistory } from "react-router-dom";
import { setAccessToken } from "../../acessToken";
import axios from "axios";
import { MutationFunction, queryCache, useMutation } from "react-query";

interface LogoutUserResponse {
  error: boolean;
  loading: boolean;
  mutate: MutationFunction<any, any>;
}

export const useLogoutUser = (): LogoutUserResponse => {
  const { push } = useHistory();
  const logoutUser = async (): Promise<any> => {
    const { data } = await axios.post("/user/me/logout");
    return data;
  };
  const [mutate, { isLoading, isError }] = useMutation(logoutUser, {
    onSuccess: () => {
      setAccessToken("");
      queryCache.invalidateQueries("user");
      push("/login");
    },
  });

  return {
    error: isError,
    loading: isLoading,
    mutate,
  };
};
