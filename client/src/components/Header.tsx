import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { useLogoutUser } from "../hooks/mutation/useLogout";
import { useUser } from "../hooks/query/useUser";

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const { user, loading } = useUser();
  const { mutate, loading: isLoading } = useLogoutUser();
  let body: any = null;
  if (loading) {
    body = null;
  } else if (user) {
    body = <div>you are logged in as {user.name} </div>;
  } else body = <div>not logged in</div>;
  return (
    <div>
      <div>
        <NavLink exact activeStyle={{ color: "red" }} to="/">
          Home
        </NavLink>
      </div>
      <div>
        <NavLink activeStyle={{ color: "red" }} to="/register">
          Register
        </NavLink>
      </div>
      <div>
        <NavLink activeStyle={{ color: "red" }} to="/login">
          Login
        </NavLink>
      </div>
      <div>
        {!loading && user && (
          <NavLink activeStyle={{ color: "red" }} to="/user">
            Profile
          </NavLink>
        )}
      </div>
      <div>
        {!loading && user ? (
          <button
            onClick={async () => {
              await mutate(null);
            }}
            disabled={isLoading}
          >
            {isLoading ? "loading..." : " logout"}
          </button>
        ) : null}
      </div>
      {body}
    </div>
  );
};
