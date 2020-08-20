import { useQuery } from "react-query";
import axios from "axios";
import { getAccessToken } from "../acessToken";

interface UseUserResponse {
  user: any;
  error: any;
  loading: boolean;
}
export const useUser = (): UseUserResponse => {
  const accessToken = getAccessToken();
  const fetchUser = async (key: string, accessToken: string) => {
    const res = await axios.get("/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  };
  const { data: user, error, isLoading } = useQuery(
    ["user", accessToken],
    fetchUser,
    { refetchOnMount: true, retry: 0 }
  );

  return {
    user,
    error,
    loading: isLoading,
  };
};
