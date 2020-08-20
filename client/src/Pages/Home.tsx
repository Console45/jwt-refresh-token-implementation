import React, { FC } from "react";
import { useUsers } from "../hooks/useUsers";

export const Home: FC<{}> = () => {
  interface User {
    name: string;
    email: string;
  }
  const { users, error, loading } = useUsers();

  if (loading) return <div>loading....</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <div>
      {users.map((user: User) => {
        return (
          <div key={user.email}>
            <span>{user.name}</span>
            <br />
            <span>{user.email}</span>
          </div>
        );
      })}
    </div>
  );
};
