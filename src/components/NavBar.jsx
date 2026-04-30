import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { FaSearch } from "react-icons/fa";
import { BiCameraMovie } from "react-icons/bi";
import { IoArrowBackSharp, IoArrowForward } from "react-icons/io5";

import styles from "./NavBar.module.css";

const NavBar = () => {
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;

    navigate(`/search?q=${search}`);
    setSearch("");
  };

  // const isMoviePage =
  //   location.pathname.startsWith("/movie/") ||
  //   location.pathname.startsWith("/search");
  return (
    <>
      <section className={styles.container}>
        <nav className={styles.navbar}>
          <div className={styles.containerLogo}>
            {/* {isMoviePage && ( */}
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <IoArrowBackSharp
                style={{
                  color: "white",
                  fontSize: "1.6rem",
                  cursor: "pointer",
                }}
                title="Voltar"
              />
            </button>
            {/* )} */}
            {/* {isMoviePage && ( */}
            <button
              className={styles.forwardButton}
              onClick={() => navigate(1)}
            >
              <IoArrowForward
                style={{
                  color: "white",
                  fontSize: "1.6rem",
                  cursor: "pointer",
                }}
                title="Avançar"
              />
            </button>
            {/* )} */}

            <Link to="/" className={styles.logoLink}>
              <h1 className={styles.logo}>
                <BiCameraMovie />
                Library Movies
              </h1>
            </Link>
          </div>

          <div>
            <form className={styles.searchForm} onSubmit={handleSubmit}>
              <input
                type="text"
                name="searchMovie"
                id="searchMovie"
                placeholder="Pesquisar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
