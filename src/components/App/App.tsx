import { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from "react-hot-toast";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";

import css from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export default function App() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["movies", query, page],
        queryFn: () => fetchMovies({ query, page }),
        enabled: query !== "",
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (!isLoading && data && data.results.length === 0) {
          toast("No movies found for your request.");
        }
      }, [data, isLoading]);
      
    const totalPages = data?.total_pages ?? 0;


    const handleSearch = (newQuery: string)=> {
        setQuery(newQuery);
        setPage(1);
        }
    
    const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie);
    };
    
    const closeModal = () => {
        setSelectedMovie(null);
    };

    return (
        <div className={css.wrapper}>
            <SearchBar onSubmit={handleSearch} />
            {data && totalPages > 1 && (
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
            {isLoading && <Loader />}
            {isError && <ErrorMessage />}
            {data?.results && data.results.length > 0 && (
                <MovieGrid movies={data.results} onSelect={handleSelectMovie}  />)}
            {selectedMovie && (<MovieModal movie={selectedMovie} onClose={closeModal} />
            )}
            <Toaster />
        </div>
    );
}
