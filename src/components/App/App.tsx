import css from "./App.module.css";
import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import fetchMovies from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Movie } from "../../types/movie";
import ReactPaginate from "react-paginate";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const { data, error, isLoading } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query as string, page),
    enabled: query !== null,
    placeholderData: keepPreviousData,
  });

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  });

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const totalPages = data?.total_pages || 0;

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {error && <ErrorMessage />}
      {isLoading && <Loader />}
      {data && data.results.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={data.results} onSelect={openModal} />
        </>
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
