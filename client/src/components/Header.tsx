import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../hooks/useUser";

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const { user, loading } = useUser();
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
        <NavLink activeStyle={{ color: "red" }} to="/user">
          Profile
        </NavLink>
      </div>
      {body}
    </div>
  );
};
