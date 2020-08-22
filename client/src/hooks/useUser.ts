import { useQuery } from "react-query";
import axios from "axios";

interface UseUserResponse {
  user: any;
  error: any;
  loading: boolean;
}
export const useUser = (): UseUserResponse => {
  const fetchUser = async (key: string) => {
    const res = await axios.get("/user/me");
    return res.data;
  };
  const { data: user, error, isLoading } = useQuery("user", fetchUser, {
    refetchOnMount: true,
    retry: 0,
  });

  return {
    user,
    error,
    loading: isLoading,
  };
};
