import axios from "axios";
import type { Movie } from "../types/movie.ts";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const  BASE_URL = "https://api.themoviedb.org/3";

interface movieServiceProps {
  query: string;
  page: number;
}

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

export default async function fetchMovies({ query, page} : movieServiceProps): Promise<MoviesResponse> {
  const response = await axios.get<MoviesResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        page,
        language: "en-US",
      },
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    }
  );

  return response.data;
};
