// To add actors:
//  add fetchActors to APIService X
//  call fetchActors from APP 
//  create Actor model X
//  add renderActors function to Page class X
//  add renderActor


class App {
  static run() {
    APIService.fetchMovie(534)
      .then(movie => {
        // add call to fetchActors, passing movie
        Page.renderMovieSection(movie)
        APIService.fetchActors(movie)
          .then(actors => {
            console.log(actors);
            Page.renderActorsSection(actors)
        })
      })
    }
}

class APIService {

  static TMDB_BASE_URL = 'https://api.themoviedb.org/3'  //https://api.themoviedb.org/3/movie/${movieId}
                                                      //https://api.themoviedb.org/3/movie/${movieId}/credits

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
    return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`
  }
}

class Page {
  static renderMovieSection(movie) {
    MovieSection.renderMovie(movie)
  }
  static renderActorsSection(movie) {
    ActorsSection.renderActors(movie)
  }
}

class MovieSection {
  static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'
  static backdrop = document.getElementById('movie-backdrop')
  static title = document.getElementById('movie-title')
  static releaseDate = document.getElementById('movie-release-date')
  static runtime = document.getElementById('movie-runtime')
  static overview = document.getElementById('movie-overview')

  static renderMovie(movie) {
    this.backdrop.src = MovieSection.BACKDROP_BASE_URL + movie.backdropPath
    this.title.innerText = movie.title
    this.releaseDate.innerText = movie.releaseDate
    this.runtime.innerText = movie.runtime + " minutes"
    this.overview.innerText = movie.overview
  }  
}

class ActorsSection {
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
    `)  
  }
}

class Actor {
  static PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'

  constructor(json) {
    //add code to create Actor
    this.name = json.name
    this.profilePath = Actor.PROFILE_BASE_URL + json.profile_path 
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
