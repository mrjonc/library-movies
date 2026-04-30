import { Link, Outlet } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { BiCameraMovie } from "react-icons/bi";
import styles from "./NavBar.module.css";

const NavBar = () => {
  return (
    <>
      <section className={styles.container}>
        <nav className={styles.navbar}>
          <div>
            <Link to="/" className={styles.logoLink}>
              <h1 className={styles.logo}>
                <BiCameraMovie />
                Library Movies
              </h1>
            </Link>
          </div>

          <div>
            <form className={styles.searchForm}>
              <input
                type="text"
                name="searchMovie"
                id="searchMovie"
                placeholder="Pesquisar"
              />
              <button type="submit">
                <FaSearch />
              </button>
            </form>
          </div>
        </nav>
      </section>
    </>
  );
};

export default NavBar;
