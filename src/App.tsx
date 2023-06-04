import "./App.css";
import { SignIn } from "./SignIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserInfo } from "./UserInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/user" element={<UserInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
