import axios from "axios";
import type { Movie } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

export interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const fetchMovies = async (query: string, page: number) => {
  const { data } = await axios.get<FetchMoviesResponse>(BASE_URL, {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return data;
};
export default fetchMovies;
