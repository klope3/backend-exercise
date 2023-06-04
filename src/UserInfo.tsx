import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@prisma/client";

export function UserInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState({} as User);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!id || !token) {
      navigate("/");
      return;
    }

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: "GET",
      headers,
    };

    fetch(`http://localhost:3000/users/${+id}`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          navigate("/");
          throw new Error("Bad response");
        }
        return res.json();
      })
      .then((json) => setUser(json))
      .catch((e) => console.error(e));
  }, []);
  return (
    <div>
      {user.id !== undefined && (
        <>
          <div>Name: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>Age: {user.age}</div>
          <div>Motto: {user.motto}</div>
        </>
      )}
    </div>
  );
}
