import { useState, useEffect } from "react";
import styles from "./Movie.module.css";
import { FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { RiMovie2AiLine } from "react-icons/ri";
import { MdOutlineDescription } from "react-icons/md";
import { IoMdTime } from "react-icons/io";

const movieURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const imagesURL = "https://image.tmdb.org/t/p/w500/";

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const getMovie = async (url) => {
    const res = await fetch(url);
    const data = await res.json();

    setMovie(data);
  };

  useEffect(() => {
    const movieUrlDetails = `${movieURL}movie/${id}?${apiKey}&language=pt-BR&append_to_response=credits`;
    getMovie(movieUrlDetails);
  }, [id]);

  if (!movie) return <p>Carregando...</p>;
  return (
    <div className={styles.details}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>{movie.title}</h1>
          <p style={{ color: "yellow", display: "flex" }}>
            <FaStar />
            {movie.vote_average.toFixed(1)}
          </p>
        </div>

        <img
          src={`${imagesURL}${movie.poster_path}`}
          alt={movie.title}
          className={styles.posterImg}
        />
      </header>

      <section className={styles.container}>
        <div>
          <h2>
            <MdOutlineDescription />
            Sinopse
          </h2>
          <p>{movie.overview}</p>
        </div>

        <div>
          <h2>
            <RiMovie2AiLine />
            Gênero
          </h2>
          <p>
            {movie.genres.map((genre, index) => (
              <span key={genre.id}>
                {genre.name}
                {index < movie.genres.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </div>

        <div>
          <h2>
            <IoMdTime />
            Duração
          </h2>
          <p>
            {Math.floor(movie.runtime / 60)}hr {movie.runtime % 60}m
          </p>
        </div>

        <div>
          <h2>Elenco & Diretor</h2>
          <p>
            {movie.credits.cast.slice(0, 10).map((actor, index) => (
              <span key={actor.id}>
                {actor.name}

                {index < 9 ? ", " : "."}
              </span>
            ))}
          </p>

          <p>
            <strong>Dirigido por: </strong>
            {movie.credits.crew.find((member) => member.job === "Director")
              ?.name || "Não informado"}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Movie;
