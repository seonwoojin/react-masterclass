const API_KEY = "dfcc7f983753635de2fcda6bc909d78d";
const BASE_PATH = "https://api.themoviedb.org/3/";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetPopularResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function getPopularMovies() {
  return fetch(
    `${BASE_PATH}movie/popular?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}
