import { Outlet, ScrollRestoration } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar.jsx";

function App() {
  return (
    <>
      <NavBar />
      <Outlet />
      <ScrollRestoration />
    </>
  );
}

export default App;
