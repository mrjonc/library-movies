import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { FaStar } from "react-icons/fa";

// Configurações da API vindas do .env
const movieURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const imagesURL = "https://image.tmdb.org/t/p/w500/";

const Home = () => {
  // 1. Estados iniciais: tentam recuperar dados do sessionStorage para não perder o progresso ao voltar
  const [movies, setMovies] = useState(() => {
    const savedMovies = sessionStorage.getItem("savedMovies");
    return savedMovies ? JSON.parse(savedMovies) : [];
  });

  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    return savedPage ? parseInt(savedPage) : 1;
  });

  // Função para buscar filmes na API
  const getMovies = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      setMovies((prevMovies) => {
        // Combina filmes atuais com os novos da próxima página
        const combinedMovies = [...prevMovies, ...data.results];

        // FILTRO DE DUPLICADOS: Garante que cada filme apareça apenas uma vez pelo ID
        const uniqueMovies = combinedMovies.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id),
        );

        // Salva a lista limpa no storage para persistência
        sessionStorage.setItem("savedMovies", JSON.stringify(uniqueMovies));
        return uniqueMovies;
      });
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  };

  // EFEITO 1: Limpa tudo se o usuário der Reload (F5) na página
  useEffect(() => {
    const navEntries = window.performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && navEntries[0].type === "reload") {
      sessionStorage.clear();
      window.scrollTo(0, 0);
      setMovies([]);
      setPage(1);
    }
  }, []);

  // EFEITO 2: Monitora a mudança de página e decide se precisa buscar novos dados
  useEffect(() => {
    const getAllMoviesURL = `${movieURL}discover/movie?${apiKey}&language=pt-BR&page=${page}`;

    // Só busca se a quantidade de filmes for menor do que o esperado para a página atual
    const shouldFetch = movies.length < page * 20;

    if (shouldFetch) {
      getMovies(getAllMoviesURL);
    }

    sessionStorage.setItem("currentPage", page);
  }, [page]);

  // EFEITO 3: Restaura a posição do scroll quando os filmes terminam de carregar
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPos");

    if (movies.length > 0 && savedPosition) {
      // Pequeno atraso para garantir que o DOM renderizou os cards
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
            key={movie.id} // Chave única e estável
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
