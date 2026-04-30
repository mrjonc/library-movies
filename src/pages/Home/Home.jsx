import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { FaStar } from "react-icons/fa";

const movieURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const imagesURL = "https://image.tmdb.org/t/p/w500/";

const checkIsReload = () => {
  if (typeof window === "undefined") return false;
  const p = window.performance;
  if (!p) return false;

  if (p.getEntriesByType) {
    const entries = p.getEntriesByType("navigation");
    if (entries.length > 0) {
      return entries[0].type === "reload";
    }
  }

  if (p.navigation) {
    return p.navigation.type === 1;
  }

  return false;
};

const Home = () => {
  const [movies, setMovies] = useState(() => {
    if (checkIsReload()) {
      return [];
    }
    const savedMovies = sessionStorage.getItem("savedMovies");
    return savedMovies ? JSON.parse(savedMovies) : [];
  });

  const [page, setPage] = useState(() => {
    if (checkIsReload()) {
      return 1;
    }
    const savedPage = sessionStorage.getItem("currentPage");
    return savedPage ? parseInt(savedPage) : 1;
  });

  const getMovies = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      setMovies((prevMovies) => {
        const combinedMovies = [...prevMovies, ...data.results];

        const uniqueMovies = combinedMovies.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id),
        );

        sessionStorage.setItem("savedMovies", JSON.stringify(uniqueMovies));
        return uniqueMovies;
      });
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  };

  useEffect(() => {
    if (checkIsReload()) {
      sessionStorage.clear();
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const getAllMoviesURL = `${movieURL}discover/movie?${apiKey}&language=pt-BR&page=${page}`;

    const shouldFetch = movies.length < page * 20;

    if (shouldFetch) {
      getMovies(getAllMoviesURL);
    }

    sessionStorage.setItem("currentPage", page);
  }, [page]);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const savedPosition = sessionStorage.getItem("scrollPos");

    if (savedPosition) {
      const timer = setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem("scrollPos");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className={styles.container} style={{ minHeight: "150vh" }}>
      <h2 className={styles.pageTitle}>Explorar Filmes</h2>

      <div className={styles.movieGrid}>
        {movies.map((movie) => (
          <Link
            className={styles.card}
            to={`/movie/${movie.id}`}
            key={movie.id}
            onClick={() => sessionStorage.setItem("scrollPos", window.scrollY)}
          >
            <img
              className={styles.posterImg}
              src={
                movie.poster_path
                  ? `${imagesURL}${movie.poster_path}`
                  : "/placeholder.png"
              }
              alt={movie.title}
            />
            <p className={styles.rating}>
              <FaStar />
              {movie.vote_average.toFixed(1)}
            </p>
            <p className={styles.movieName}>{movie.title}</p>
          </Link>
        ))}
      </div>

      <button
        onClick={() => setPage((prev) => prev + 1)}
        className={styles.button}
      >
        Carregar Mais...
      </button>
    </div>
  );
};

export default Home;
