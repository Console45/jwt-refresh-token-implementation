import React, { FC } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Header } from "../components/Header";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Profile } from "../Pages/Profile";
import { Register } from "../Pages/Register";
import { ProtectedRoute } from "./ProtectedRoute";

export const Routes: FC = () => {
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
          <ProtectedRoute path="/user" component={Profile} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};
