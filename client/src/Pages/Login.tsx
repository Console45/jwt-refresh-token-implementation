import React, { FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useLoginUser } from "../hooks/useLoginUser";

interface LoginProps {}

export const Login: FC<LoginProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate, error, loading, success } = useLoginUser();

  const history = useHistory();

  useEffect(() => {
    if (success) history.push("/user");
  }, [success, history]);

  return (
    <div>
      Login Page
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await mutate({ email, password });
          }}
        >
          <div>{error && <p>Failed</p>}</div>

          <div>
            <input
              type="email"
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button disabled={loading}>{loading ? "loading.." : "submit"}</button>
        </form>
      </div>
    </div>
  );
};
