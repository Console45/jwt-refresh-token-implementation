import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import * as serviceWorker from "./serviceWorker";
import { Routes } from "./routes/Routes";
import { ReactQueryDevtools } from "react-query-devtools";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryDevtools initialIsOpen={false} />
    <Routes />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
