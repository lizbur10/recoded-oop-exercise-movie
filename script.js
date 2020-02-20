// To add actors:
//  add fetchActors to APIService X
//  call fetchActors from APP 
//  create Actor model X
//  add renderActors function to Page class X
// add renderActor


const TMDB_BASE_URL = 'https://api.themoviedb.org/3'  //https://api.themoviedb.org/3/movie/${movieId}
                                                      //https://api.themoviedb.org/3/movie/${movieId}/credits
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'

class App {
  static run() {
    APIService.fetchMovie(534)
      .then(movie => {
        // add call to fetchActors, passing movie
        Page.renderMovie(movie)
        APIService.fetchActors(movie)
          .then(actors => {
            console.log(actors);
            Page.renderActors(actors)
      })})
    }
}

class APIService {

  static fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`)
    return fetch(url)
      .then(res => res.json())
      .then(json => new Movie(json))
  }

  static fetchActors(movie) {
    // write code to fetch the actors 
    const url = APIService._constructUrl(`movie/${movie.id}/credits`)
    return fetch(url)
      .then(res => res.json())
      .then(json => json.cast.slice(0,4).map(actor => new Actor(actor)))
  }

  static  _constructUrl(path) {
    return `${TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`
  }
}

class Page {
  static backdrop = document.getElementById('movie-backdrop')
  static title = document.getElementById('movie-title')
  static releaseDate = document.getElementById('movie-release-date')
  static runtime = document.getElementById('movie-runtime')
  static overview = document.getElementById('movie-overview')

  static renderMovie(movie) {
    Page.backdrop.src = BACKDROP_BASE_URL + movie.backdropPath
    Page.title.innerText = movie.title
    Page.releaseDate.innerText = movie.releaseDate
    Page.runtime.innerText = movie.runtime + " minutes"
    Page.overview.innerText = movie.overview
  }

  static actorsList = document.getElementById('actors');

  static renderActors(actors) {
    // add code to render Actors
    // Questions: 
    //    how do we handle selecting the first four?
    //    how do we handle rendering the individual actors?
    actors.forEach(actor => this.renderActor(actor));
  }

  static renderActor(actor) {
    this.actorsList.insertAdjacentHTML('beforeend', `
      <li class="col-md-3">
        <div class="row">
          <img src="${actor.profilePath}"/>
        </div>
        <div class="row">
          <h3>${actor.name}</h3>
        </div>
      </li>
    `)  }
}

class Actor {
  constructor(json) {
    //add code to create Actor
    this.name = json.name
    this.profilePath = PROFILE_BASE_URL + json.profile_path 
  }
}

class Movie {
  constructor(json) {
    this.id = json.id
    this.title = json.title
    this.releaseDate = json.release_date
    this.runtime = json.runtime
    this.overview = json.overview
    this.backdropPath = json.backdrop_path
  }
}

document.addEventListener("DOMContentLoaded", App.run);
