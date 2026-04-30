import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { FaStar } from "react-icons/fa";

const movieURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const imagesURL = "https://image.tmdb.org/t/p/w500/";

const Home = () => {
  const [movies, setMovies] = useState(() => {
    const savedMovies = sessionStorage.getItem("savedMovies");
    return savedMovies ? JSON.parse(savedMovies) : [];
  });

  const [page, setPage] = useState(() => {
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
    const navEntries = window.performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && navEntries[0].type === "reload") {
      sessionStorage.clear();
      window.scrollTo(0, 0);
      setMovies([]);
      setPage(1);
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
    const savedPosition = sessionStorage.getItem("scrollPos");

    if (movies.length > 0 && savedPosition) {
      const timer = setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem("scrollPos");
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [movies]);

  return (
    <div className={styles.container}>
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
