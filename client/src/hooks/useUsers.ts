import axios from "axios";
import { useQuery } from "react-query";

interface UseUsersResponse {
  users: any;
  error: any;
  loading: boolean;
}
export const useUsers = (): UseUsersResponse => {
  const fetchUsers = async (key: string) => {
    const { data } = await axios.get("/users");
    return data;
  };

  const { isLoading, data: users, error } = useQuery("users", fetchUsers, {
    retry: 1,
  });

  return {
    users,
    error,
    loading: isLoading,
  };
};
