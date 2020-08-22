import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { ReactQueryDevtools } from "react-query-devtools";
import * as serviceWorker from "./serviceWorker";
import { App } from "./App";
import { getAccessToken, setAccessToken } from "./acessToken";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (request) => {
    const accessToken = getAccessToken();
    if (accessToken) request.headers["Authorization"] = `Bearer ${accessToken}`;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createAuthRefreshInterceptor(axios, async (failedRequest) => {
  const { data } = await axios.post("/refresh_token");
  setAccessToken(data.accessToken);
  failedRequest.response.config.headers[
    "Authorization"
  ] = `Bearer ${data.accessToken}`;
});

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryDevtools initialIsOpen={false} />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
