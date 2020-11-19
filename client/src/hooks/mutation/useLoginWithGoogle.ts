import { useHistory } from "react-router-dom";
import { setAccessToken } from "../../acessToken";
import axios from "axios";
import { MutationFunction, queryCache, useMutation } from "react-query";

type IdToken = string;
interface LoginWithGoogleResponse {
  error: boolean;
  success: boolean;
  loading: boolean;
  mutate: MutationFunction<any, IdToken>;
}

export const useLoginWithGoogle = (): LoginWithGoogleResponse => {
  const { push } = useHistory();
  const loginWithGoogle = async (idToken: IdToken) => {
    const { data } = await axios.post("/google_login", { idToken });
    return data;
  };
  const [mutate, { isLoading, isError, isSuccess }] = useMutation(
    loginWithGoogle,
    {
      onSuccess: ({ accessToken }) => {
        setAccessToken(accessToken);
        queryCache.invalidateQueries("user");
        push("/user");
      },
    }
  );

  return {
    error: isError,
    success: isSuccess,
    loading: isLoading,
    mutate,
  };
};
