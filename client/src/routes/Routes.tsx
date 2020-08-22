import React, { FC } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { getAccessToken } from "../acessToken";
import { Header } from "../components/Header";
import { useUser } from "../hooks/useUser";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Profile } from "../pages/Profile";
import { Register } from "../pages/Register";

interface PropTypes {
  component: any;
  path: string;
  user: any;
}

const ProtectedRoute: FC<PropTypes> = ({
  component: Component,
  path,
  user,
}) => {
  const accessToken = getAccessToken();
  return accessToken || user ? (
    <Route path={path}>
      <Component />
    </Route>
  ) : (
    <Redirect to={{ pathname: "/login" }} />
  );
};

export const Routes: FC = () => {
  const { user } = useUser();

  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <ProtectedRoute path="/user" component={Profile} user={user} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};
