const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'

document.addEventListener("DOMContentLoaded", autorun);

function autorun() {
    fetchMovie(534)
      .then(movie => renderMovie(movie))
}

function fetchMovie(movieId) {
    const url = constructUrl(`movie/${movieId}`)
    return fetch(url)
        .then(res => res.json())
        .then(json => json)
}

function constructUrl(path) {
    return `${TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`
}

function renderMovie(movie) {
    const backdrop = document.getElementById('movie-backdrop')
    const title = document.getElementById('movie-title')
    const releaseDate = document.getElementById('movie-release-date')
    const runtime = document.getElementById('movie-runtime')
    const overview = document.getElementById('movie-overview')

    backdrop.src = BACKDROP_BASE_URL + movie.backdrop_path
    title.innerText = movie.title
    releaseDate.innerText = movie.release_date
    runtime.innerText = movie.runtime + " minutes"
    overview.innerText = movie.overview
}

