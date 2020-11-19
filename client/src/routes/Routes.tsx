import React, { FC } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Header } from "../components/Header";
import { useUser } from "../hooks/useUser";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Profile } from "../pages/Profile";
import { Register } from "../pages/Register";
import { ProtectedRoute } from "./ProtectedRoute";

export const Routes: FC = () => {
  const { user, loading } = useUser();
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
          <ProtectedRoute
            path="/user"
            user={user}
            loading={loading}
            component={Profile}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
};
