import { FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const navigate = useNavigate();

  function submitSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const body = JSON.stringify({
      email,
      password,
    });
    const requestOptions = {
      method: "POST",
      headers,
      body,
    };

    fetch("http://localhost:3000/auth/login", requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        localStorage.setItem("token", json.token);
        localStorage.setItem("userId", json.userId);
      })
      .then(() => navigate("/user"))
      .catch((e) => console.error(e));
  }

  return (
    <>
      <form onSubmit={submitSignIn}>
        <div>
          <label htmlFor="email">
            Email
            <input type="text" name="email" id="email" />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            Password
            <input type="text" name="password" id="password" />
          </label>
        </div>
        <div>
          <button type="submit">Sign In</button>
        </div>
      </form>
    </>
  );
}
