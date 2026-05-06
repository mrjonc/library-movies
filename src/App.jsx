import { Outlet, ScrollRestoration } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home/Home.jsx";
import Movie from "./pages/Movie/Movie.jsx";
import Search from "./pages/Search/Search.jsx";

function App() {
  const [page, setPage] = useState("home");
  return (
    <>
      <NavBar setPage={setPage} />
      {setPage === "Home" && <Home />}
      {setPage === "Movie" && <Movie />}
      {setPage === "Search" && <Search />}
      <Outlet />
      <ScrollRestoration />
    </>
  );
}

export default App;
