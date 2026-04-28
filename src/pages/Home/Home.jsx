import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { FaStar } from "react-icons/fa";

const movieURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const imagesURL = "https://image.tmdb.org/t/p/w500/";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const getMovies = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      setMovies((prevMovies) => [...prevMovies, ...data.results]);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  };

  useEffect(() => {
    const getAllMoviesURL = `${movieURL}discover/movie?${apiKey}&language=pt-BR&page=${page}`;

    getMovies(getAllMoviesURL);
  }, [page]);
  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Explorar Filmes</h2>

      <div className={styles.movieGrid}>
        {movies.map((movie) => (
          <div className={styles.card} key={`${movie.id}-${Math.random()}`}>
            <img
              className={styles.posterImg}
              src={`${imagesURL}${movie.poster_path}`}
              alt={movie.title}
            />
            <p className={styles.rating}>
              <FaStar />
              {movie.vote_average.toFixed(1)}
            </p>
            <p className={styles.movieName}>{movie.title}</p>
          </div>
        ))}
      </div>

      {/* Botão para carregar mais */}
      <button
        onClick={() => setPage(page + 1)} // Aumenta a página, disparando o useEffect
        className={styles.button}
      >
        Carregar Mais...
      </button>
    </div>
  );
};

export default Home;
