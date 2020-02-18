document.addEventListener("DOMContentLoaded", autorun);
function autorun() {
  // const page = new Page()
  TheMovieDatabaseAPI.fetchRandomMovie()
    .then(movie => {
      Page.renderMovie(movie)
      return TheMovieDatabaseAPI.fetchMovieCredits(movie.id)
    })
    .then(actors => Page.renderActors(actors))
}
class TheMovieDatabaseAPI {
  static TMDB_BASE_URL = 'https://api.themoviedb.org/3'
  static fetchRandomMovie() {
    const movieId = Math.ceil(Math.random() * 10000)
    return TheMovieDatabaseAPI.fetchMovie(movieId)
  }
  static fetchMovie(movieId) {
    console.log("Movie ID: ", movieId);
    const url = TheMovieDatabaseAPI.constructUrl(`movie/${movieId}`)
    return fetch(url)
      .then(res => res.json())
      .then(json => new Movie(json))
  }
  static constructUrl(path) {
    return `${TheMovieDatabaseAPI.TMDB_BASE_URL}/${path}?api_key=542003918769df50083a13c415bbc602`
  }
  static fetchMovieCredits(movieId) {
    const url = TheMovieDatabaseAPI.constructUrl(`movie/${movieId}/credits`)
    return fetch(url)
      .then(res => res.json())
      .then(json => json.cast.slice(0, 4).map(cast => new Actor(cast)))
  }
}
class Actor {
  static PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'
  constructor(json) {
    this.id = json.id
    this.name = json.name
    this.profilePath = json.profile_path
  }
  get profile() {
    return Actor.PROFILE_BASE_URL + this.profilePath
  }
}
class Movie {
  static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'
  constructor(json) {
    this.id = json.id
    this.title = json.title
    this.backdropPath = json.backdrop_path
    this.releaseDate = json.release_date
    this.overview = json.overview
    this.runtimeMinutes = json.runtime
  }
  get backdrop() {
    return Movie.BACKDROP_BASE_URL + this.backdropPath
  }
  get runtime() {
    return `${this.runtimeMinutes} minutes`
  }
}
class MovieView {
  static backdrop = document.getElementById('movie-backdrop')
  static title = document.getElementById('movie-title')
  static releaseDate = document.getElementById('movie-release-date')
  static runtime = document.getElementById('movie-runtime')
  static overview = document.getElementById('movie-overview')
  static render(movie) {
    MovieView.backdrop.src = movie.backdrop
    MovieView.title.innerText = movie.title
    MovieView.releaseDate.innerText = movie.releaseDate
    MovieView.runtime.innerText = movie.runtime
    MovieView.overview.innerText = movie.overview
  }
}
class ActorsView {
  static actorsList = document.getElementById('actors')
  static renderActor(actor) {
    ActorsView.actorsList.insertAdjacentHTML('beforeend', `
      <li class="col-md-3">
        <div class="row">
          <img src="${actor.profile}">
        </div>
        <div class="row">
          <h3>${actor.name}</h3>
        </div>
      </li>
    `)
  }
  static render(actors) {
    actors.forEach(actor => ActorsView.renderActor(actor))
  }
}
class Page {
  static renderMovie(movie) {
    MovieView.render(movie)
  }
  static renderActors(actors) {
    ActorsView.render(actors)
  }
}