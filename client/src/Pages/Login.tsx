import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";
import { LoginUserResponse, useLoginUser } from "../hooks/useLoginUser";

interface LoginProps {}

export const Login: FC<LoginProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const loginUser = useLoginUser();
  const history = useHistory();

  return (
    <div>
      Login Page
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const {
              data,
              error,
              login,
              accessToken,
            }: LoginUserResponse = await loginUser({
              email,
              password,
            });
            console.log(data);
            console.log(error);
            console.log(login);
            console.log(accessToken);

            history.push("/");
          }}
        >
          <div></div>
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
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};
