import React, { FC } from "react";
import { NavLink } from "react-router-dom";

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
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
    </div>
  );
};
