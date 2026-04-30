import { useState, useEffect, useLayoutEffect } from "react";
import { Link, useSearchParams, useNavigationType } from "react-router-dom";
import styles from "./Search.module.css";
import { FaStar } from "react-icons/fa";

// Configurações da API vindas do .env
const movieURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const imagesURL = "https://image.tmdb.org/t/p/w500/";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);

  const query = searchParams.get("q");
  const navigationType = useNavigationType();

  const getSearchedMovies = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      setMovies(data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.performance) {
      const navEntries = window.performance.getEntriesByType("navigation");
      if (navEntries.length > 0 && navEntries[0].type === "reload") {
        sessionStorage.clear();
        window.scrollTo(0, 0);
      }
    }
  }, []);

  useEffect(() => {
    if (query) {
      const searchMoviesByURL = `${movieURL}search/movie?${apiKey}&query=${query}&language=pt-BR`;
      getSearchedMovies(searchMoviesByURL);
    }
  }, [query]);

  useLayoutEffect(() => {
    if (navigationType === "POP") {
      const savedPosition = sessionStorage.getItem("scrollPos");

      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
        sessionStorage.removeItem("scrollPos"); // Limpa após utilizar
      }
    }
  }, [navigationType]);

  return (
    <div className={styles.container}>
      <h2 className={styles.search}>Resultados para: {query}</h2>

      <div className={styles.movieGrid}>
        {movies.length > 0 &&
          movies.map((movie) => (
            <Link
              className={styles.card}
              to={`/movie/${movie.id}`}
              key={movie.id}
              onClick={() =>
                sessionStorage.setItem("scrollPos", window.scrollY)
              }
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
                {movie.vote_average?.toFixed(1)}
              </p>
              <p className={styles.movieName}>{movie.title}</p>
            </Link>
          ))}
      </div>

      {movies.length === 0 && (
        <p style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>
          Nenhum filme encontrado para o termo pesquisado.
        </p>
      )}
    </div>
  );
};

export default Search;
