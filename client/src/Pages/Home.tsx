import React, { FC } from "react";
import axios from "axios";
import useSWR from "swr";

export const Home: FC<{}> = () => {
  const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
  };
  const { data: users, error } = useSWR("/users", fetcher);

  interface User {
    name: string;
    email: string;
  }

  const isLoading = !users && !error;
  return isLoading ? (
    <div>loading...</div>
  ) : (
    <div>
      <div>Home Page</div>
      {users.map((user: User) => (
        <div key={user.email}>
          <span>name: </span> <span> {user.name}</span>
          <br />
          <span>email: </span> <span> {user.email}</span>
        </div>
      ))}
    </div>
  );
};
