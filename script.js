const TMDB_BASE_URL = 'https://api.themoviedb.org/3'        // full url for movie add 'movie/<movieId>?api_key=542003918769df50083a13c415bbc602'
                                                            // full url for actors add 'movie/${movieId}/credits?api_key=542003918769df50083a13c415bbc602'
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'   // full url add '/<profile_path>' (from actor JSON)
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'  // full url add '/<backdrop_path>' (from movie JSON)

document.addEventListener('DOMContentLoaded', autorun);

function autorun() {
  // const movieId = 534; //Terminator Salvation
  // const movieId = 1250; //Ghost Rider
  const movieId =  3034; //Young Frankenstein
  const page = new Page();
  const movie = APIService.fetchMovie(movieId); // returns a movie instance
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
    fetch(this.constructUrl(`movie/${movieId}`))
      .then(resp => resp.json())
      .then(json => {
        renderMovie(json);
        this.fetchActors(movieId);
      })
      //.then(json => new Movie(json))
  }

  static constructUrl(path) {
    return `${TMDB_BASE_URL}/${path}?api_key=542003918769df50083a13c415bbc602`;
  }

  static fetchActors(movieId) {
    fetch(this.constructUrl(`movie/${movieId}/credits`))
      .then(actorResp => actorResp.json())
      .then(actorJson => renderActors(actorJson.cast.slice(0,4)));
  }

} //end APIService


class Page {
  static MovieSection(movie) {
    renderMovie(movie);
  }
  static ActorsSection(movie) {
    renderActors(movie.actors);
  }
} 


function renderMovie(movie) {
  const movieBackdrop = document.getElementById('movie-backdrop');
  const movieTitle = document.getElementById('movie-title');
  const movieReleaseDate = document.getElementById('movie-release-date');
  const movieRuntime = document.getElementById('movie-runtime');
  const movieOverview = document.getElementById('movie-overview');

  movieBackdrop.src = `${BACKDROP_BASE_URL}/${movie.backdrop_path}`;
  movieTitle.innerHTML = movie.title;
  movieReleaseDate.innerHTML = movie.release_date;
  movieRuntime.innerHTML = movie.runtime + ' minutes';
  movieOverview.innerHTML = movie.overview;
}


function renderActors(actors) {
  actors.forEach(actor => renderActor(actor));
}

function renderActor(actor) {
  const actorList = document.getElementById('actors');
  const imageSrc = `${PROFILE_BASE_URL}/${actor.profile_path}`
  actorList.insertAdjacentHTML('beforeend', `
    <li class = 'col-md-3'>
      <div class='row'>
        <img src="${imageSrc}">
      </div>
      <div class='row'>
        <h3>${actor.name}</h3>
      </div>
    </li>
  `)
}