import React, { FC } from "react";
import { Redirect, Route } from "react-router-dom";
import { getAccessToken } from "../acessToken";
import { useUser } from "../hooks/query/useUser";

interface ProtectedRouteProps {
  component: any;
  path: string;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  component: Component,
  path,
}) => {
  const { user, loading } = useUser();
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
