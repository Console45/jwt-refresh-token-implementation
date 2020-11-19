import React, { FC, useState } from "react";
import { useCreateUser } from "../hooks/mutation/useCreateUser";

interface RegisterProps {}

export const Register: FC<RegisterProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate, error, loading } = useCreateUser();

  return (
    <div>
      Register Page
      <form
        onSubmit={async e => {
          e.preventDefault();
          await mutate({ name, email, password });
        }}
      >
        <div>{error && <p>Failed</p>}</div>

        <div>
          <input
            type="text"
            value={name}
            placeholder="name"
            onChange={e => setName(e.target.value)}
          />
        </div>
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
        <button disabled={loading}>{loading ? "loading.." : "submit"}</button>
      </form>
    </div>
  );
};
