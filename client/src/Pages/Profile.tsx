import React, { FC } from "react";
import { useUser } from "../hooks/useUser";

interface ProfileProps {}

export const Profile: FC<ProfileProps> = () => {
  const { user, error, loading } = useUser();

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <div>
      <div>My user Profile</div>
      {user && (
        <div>
          <span>name: </span> <span> {user.name}</span>
          <br />
          <span>email: </span> <span> {user.email}</span>
        </div>
      )}
    </div>
  );
};
