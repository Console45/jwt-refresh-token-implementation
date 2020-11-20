import { useHistory } from "react-router-dom";
import { setAccessToken } from "../../acessToken";
import axios from "axios";
import { queryCache, useMutation } from "react-query";

type IdToken = string;
interface LoginWithGoogleResponse {
  error: boolean;
  success: boolean;
  loading: boolean;
  sendGoogleResponse: (response: any) => Promise<void>;
}

export const useLoginWithGoogle = (): LoginWithGoogleResponse => {
  const { push } = useHistory();
  const loginWithGoogle = async (idToken: IdToken): Promise<any> => {
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
  const sendGoogleResponse = async (response: any): Promise<void> => {
    await mutate(response.tokenId);
  };
  return {
    error: isError,
    success: isSuccess,
    loading: isLoading,
    sendGoogleResponse,
  };
};
