import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import * as serviceWorker from "./serviceWorker";
import { ReactQueryDevtools } from "react-query-devtools";
import { App } from "./App";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryDevtools initialIsOpen={false} />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
