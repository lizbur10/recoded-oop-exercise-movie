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
  static container = document.getElementById('container');
  static renderMovieSection(movie) {
    MovieSection.renderMovie(movie)
  }
  static renderActorsSection(movie) {
    ActorsSection.renderActors(movie)
  }
}

class MovieSection {
  static renderMovie(movie) {
    Page.container.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="movie-release-date">${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
        </div>
      </div>
      <h3>Actors:</h3>
    `
  }

}

class ActorsSection {
  static actorsList = document.getElementById('actors');

  static renderActors(actors) {
    // add code to render Actors
    // Questions: 
    //    how do we handle selecting the first four?
    //    how do we handle rendering the individual actors?
    const actorsContainer = document.createElement('ul');
    actorsContainer.setAttribute('class', "list-unstyled")
    actorsContainer.setAttribute('id', 'actors');
    Page.container.appendChild(actorsContainer);
      actors.forEach(actor => this.renderActor(actor,actorsContainer));
  }

  static renderActor(actor, actorsContainer) {
    actorsContainer.insertAdjacentHTML('beforeend', `
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
  static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'

  constructor(json) {
    this.id = json.id
    this.title = json.title
    this.releaseDate = json.release_date
    this.runtime = json.runtime
    this.overview = json.overview
    this.backdropPath = json.backdrop_path
  }

  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : ""
  }
}

document.addEventListener("DOMContentLoaded", App.run);
