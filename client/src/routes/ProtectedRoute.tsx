import React, { FC } from "react";
import { Redirect, Route } from "react-router-dom";
import { getAccessToken } from "../acessToken";

interface ProtectedRouteProps {
  component: any;
  path: string;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  component: Component,
  path,
}) => {
  const accessToken = getAccessToken();
  return accessToken ? (
    <Route path={path}>
      <Component />
    </Route>
  ) : (
    <Redirect to={{ pathname: "/login" }} />
  );
};
