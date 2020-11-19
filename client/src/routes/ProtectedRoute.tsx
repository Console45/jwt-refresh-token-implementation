import React, { FC } from "react";
import { Redirect, Route } from "react-router-dom";
import { getAccessToken } from "../acessToken";

interface ProtectedRouteProps {
  component: any;
  path: string;
  user: any;
  loading: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  component: Component,
  path,
  loading,
  user,
}) => {
  const accessToken = getAccessToken();
  if (loading) return <p>loading...</p>;
  return accessToken && user ? (
    <Route path={path}>
      <Component />
    </Route>
  ) : (
    <Redirect to={{ pathname: "/login" }} />
  );
};
