const TMDB_BASE_URL = 'https://api.themoviedb.org/3'        // full url for movie add 'movie/<movieId>?api_key=542003918769df50083a13c415bbc602'
                                                            // full url for actors add 'movie/${movieId}/credits?api_key=542003918769df50083a13c415bbc602'
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'   // full url add '/<profile_path>' (from actor JSON)
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'  // full url add '/<backdrop_path>' (from movie JSON)

document.addEventListener('DOMContentLoaded', autorun);

function autorun() {
  // const movieId = 534; //Terminator Salvation
  // const movieId = 1250; //Ghost Rider
  const movieId =  3034; //Young Frankenstein
  APIService.fetchMovie(movieId)
    .then(movie => {
      Page.renderMovieSection(movie)
      return APIService.fetchActors(movie)
    })
    .then(actors => Page.renderActorsSection(actors))
}

//CLASSES:
//  APIService - takes care of fetches and related functions
//  Movie - creates movie instance with needed attributes (needs a constructor)
//  Actor - creates actor instances with needed attributes (needs a constructor)
//  Page - Has a section for movie and actors and calls the corresponding methods 
//  MovieSection - grabs the needed html elements and renders the movie on the page 
    // Will include a static render method
//  ActorsSection - Takes the first four actors and passes them to RenderActor
    // Will include two static render methods

class APIService {

  static fetchMovie(movieId) {
    return fetch(this.constructUrl(`movie/${movieId}`))
      .then(resp => resp.json())
      .then(json => new Movie(json))
  }

  static constructUrl(path) {
    return `${TMDB_BASE_URL}/${path}?api_key=542003918769df50083a13c415bbc602`;
  }

  static fetchActors(movie) {
    return fetch(this.constructUrl(`movie/${movie.id}/credits`))
      .then(actorResp => actorResp.json())
      .then(actorJson => actorJson.cast.slice(0,4).map(actor => new Actor(actor)));
  }

} //end APIService

class Movie {
  constructor(json) {
    this.id = json.id
    this.title = json.title
    this.backdropPath = BACKDROP_BASE_URL + json.backdrop_path
    this.releaseDate = json.release_date
    this.overview = json.overview
    this.runtime = json.runtime + " minutes"
  }
}

class Actor {
  constructor(json) {
    this.imageSrc = `${PROFILE_BASE_URL}/${json.profile_path}`
    this.name = json.name
  }
}

class Page {
  static renderMovieSection(movie) {
    // MovieSection.render(movie);
    renderMovie(movie)
  }
  static renderActorsSection(actors) {
    // ActorsSection.render(actors);
    renderActors(actors)
  }
} 


function renderMovie(movie) {
  const movieBackdrop = document.getElementById('movie-backdrop');
  const movieTitle = document.getElementById('movie-title');
  const movieReleaseDate = document.getElementById('movie-release-date');
  const movieRuntime = document.getElementById('movie-runtime');
  const movieOverview = document.getElementById('movie-overview');

  movieBackdrop.src = movie.backdropPath;
  movieTitle.innerHTML = movie.title;
  movieReleaseDate.innerHTML = movie.releaseDate;
  movieRuntime.innerHTML = movie.runtime;
  movieOverview.innerHTML = movie.overview;
}


function renderActors(actors) {
  actors.forEach(actor => renderActor(actor));
}

function renderActor(actor) {
  const actorList = document.getElementById('actors');
  actorList.insertAdjacentHTML('beforeend', `
    <li class = 'col-md-3'>
      <div class='row'>
        <img src="${actor.imageSrc}">
      </div>
      <div class='row'>
        <h3>${actor.name}</h3>
      </div>
    </li>
  `)
}