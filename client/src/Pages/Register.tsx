import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";
import { mutate } from "swr";
import { CreateUserResponse, useCreateUser } from "../hooks/useCreateUser";

interface RegisterProps {}

export const Register: FC<RegisterProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const createUser = useCreateUser();
  const history = useHistory();

  return (
    <div>
      Register Page
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("form submitted");
          const {
            data,
            accessToken,
            error,
          }: CreateUserResponse = await createUser({
            name,
            email,
            password,
          });
          history.push("/");
          console.log(error);
          console.log(data);
          console.log(accessToken);
          mutate("/users");
        }}
      >
        <div>
          <input
            type="text"
            value={name}
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
  );
};
