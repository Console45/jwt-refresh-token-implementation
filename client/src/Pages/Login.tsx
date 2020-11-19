import React, { FC, useState } from "react";
import { useLoginUser } from "../hooks/mutation/useLoginUser";
import { GoogleLogin } from "react-google-login";
import { useLoginWithGoogle } from "../hooks/mutation/useLoginWithGoogle";

interface LoginProps {}

export const Login: FC<LoginProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate, error, loading } = useLoginUser();
  const {
    mutate: mutateGoogleLogin,
    loading: googleLoginLoading,
    error: googleLoginError,
  } = useLoginWithGoogle();

  return (
    <div>
      Login Page
      <div>
        <form
          onSubmit={async e => {
            e.preventDefault();
            await mutate({ email, password });
          }}
        >
          <div>{error && <p>Login Failed</p>}</div>
          <div>{googleLoginError && <p>Google Login Failed</p>}</div>
          <div>
            <input
              type="email"
              value={email}
              placeholder="email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder="password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button disabled={loading}>{loading ? "Loading.." : "Submit"}</button>
        </form>
        <GoogleLogin
          clientId="51739444378-2nbiksb4bcncqin768uaqk71gh4toh26.apps.googleusercontent.com"
          buttonText={`${googleLoginLoading ? "Loading..." : "Login"}`}
          onSuccess={(response: any) => mutateGoogleLogin(response.tokenId)}
          onFailure={(response: any) => mutateGoogleLogin(response.tokenId)}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    </div>
  );
};
