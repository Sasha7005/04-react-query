import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);

  function openMovieModal(movie: Movie): void {
    setSelectedMovie(movie);
  }
  function closeMovieModal(): void {
    setSelectedMovie(null);
  }
  async function onSubmit(query: string): Promise<void> {
    try {
      setMovies([]);
      setError(false);
      setIsLoading(true);

      const movies = await fetchMovies(query);

      if (movies.length === 0)
        toast.error("No movies found for your request.", {
          duration: 4000,
          position: "top-center",
        });
      setMovies(movies);
    } catch {
      setError(true);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Toaster />
      <SearchBar onSubmit={onSubmit} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={openMovieModal} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeMovieModal} />
      )}
    </>
  );
}
