import { useHistory } from "react-router-dom";
import { setAccessToken } from "../../acessToken";
import { MutationFunction, queryCache, useMutation } from "react-query";
import axios from "axios";

interface NewUser {
  name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  error: boolean;
  loading: boolean;
  mutate: MutationFunction<any, NewUser>;
}

export const useCreateUser = (): CreateUserResponse => {
  const { push } = useHistory();
  const createUser = async (variables: NewUser): Promise<any> => {
    const { data } = await axios.post("/user/register", variables);
    return data;
  };

  const [mutate, { isLoading, isError }] = useMutation(createUser, {
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      queryCache.invalidateQueries("users");
      push("/user");
    },
  });

  return {
    error: isError,
    loading: isLoading,
    mutate,
  };
};
