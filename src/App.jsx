import { Outlet, ScrollRestoration } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar.jsx";

function App() {
  const [page, setPage] = useState("home");
  return (
    <>
      <NavBar />

      <Outlet />
      <ScrollRestoration />
    </>
  );
}

export default App;
