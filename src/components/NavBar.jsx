import { Link, Outlet } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

const NavBar = () => {
  return (
    <>
      <section>
        <nav id="navbar">
          <Link to="/">
            <h1>Library Movies</h1>
          </Link>

          <form>
            <input
              type="text"
              name="searchMovie"
              id="searchMovie"
              placeholder="Pesquisar"
            />
            <button type="submit">
              <CiSearch />
            </button>
          </form>

          <Outlet />
        </nav>
      </section>
    </>
  );
};

export default NavBar;
