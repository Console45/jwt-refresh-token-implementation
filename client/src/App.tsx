import React, { FC, useEffect, useState } from "react";
import { Routes } from "./routes/Routes";
import axios from "axios";
import { setAccessToken } from "./acessToken";

interface AppProps {}

export const App: FC<AppProps> = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      const { data } = await axios.post("/refresh_token");
      setAccessToken(data.accessToken);
    };
    refreshToken();
    setLoading(false);
  }, []);

  if (loading) {
    return <div>loading..</div>;
  }
  return <Routes />;
};
