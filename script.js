//CLASSES:
//  APIService - takes care of fetches and related functions
//  Movie - creates movie instance with needed attributes (needs a constructor)
//  Actor - creates actor instances with needed attributes (needs a constructor)
//  Page - Has a section for movie and actors and calls the corresponding methods 
//  MovieSection - grabs the needed html elements and renders the movie on the page 
    // Will include a static render method
//  ActorsSection - Takes the first four actors and passes them to RenderActor
    // Will include two static render methods

document.addEventListener('DOMContentLoaded', autorun);

function autorun() {
  // const movieId = 534; //Terminator Salvation
  // const movieId = 1250; //Ghost Rider
  // const movieId =  3034; //Young Frankenstein
  APIService.fetchRandomMovie()
    .then(movie => {
      Page.renderMovieSection(movie)
      return APIService.fetchActors(movie)
    })
    .then(actors => Page.renderActorsSection(actors))
}

class APIService {

  static fetchMovie(movieId) {
    return fetch(this.constructUrl(`movie/${movieId}`))
      .then(resp => resp.json())
      .then(json => new Movie(json))
  }

  static fetchRandomMovie() {
    const movieId = Math.ceil(Math.random() * 10000);
    return APIService.fetchMovie(movieId)
      // .then(movie => {
      //   console.log(movie.title);
      //   if (!movie.title) {
      //     this.fetchRandomMovie();
      //   } else {
      //     return movie;
      //   }
      // })
  }

  static TMDB_BASE_URL = 'https://api.themoviedb.org/3'        // full url for movie add 'movie/<movieId>?api_key=542003918769df50083a13c415bbc602'
                                                            // full url for actors add 'movie/${movieId}/credits?api_key=542003918769df50083a13c415bbc602'

  static constructUrl(path) {
    return `${this.TMDB_BASE_URL}/${path}?api_key=542003918769df50083a13c415bbc602`;
  }

  static fetchActors(movie) {
    return fetch(this.constructUrl(`movie/${movie.id}/credits`))
      .then(actorResp => actorResp.json())
      .then(actorJson => actorJson.cast.slice(0,4).map(actor => new Actor(actor)));
  }

} //end APIService

class Page {
  static renderMovieSection(movie) {
    MovieSection.renderMovie(movie);
  }
  static renderActorsSection(actors) {
    ActorsSection.renderActors(actors);
  }
} 

class Movie {
  static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'  // full url add '/<backdrop_path>' (from movie JSON)


  constructor(json) {
    this.id = json.id
    this.title = json.title
    this.backdropPath = Movie.BACKDROP_BASE_URL + json.backdrop_path
    this.releaseDate = json.release_date
    this.overview = json.overview
    this.runtime = json.runtime + " minutes"
  }
}

class Actor {
  static PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'   // full url add '/<profile_path>' (from actor JSON)

  constructor(json) {
    this.imageSrc = `${Actor.PROFILE_BASE_URL}/${json.profile_path}`
    this.name = json.name
  }

}



class MovieSection {
  static movieBackdrop = document.getElementById('movie-backdrop');
  static movieTitle = document.getElementById('movie-title');
  static movieReleaseDate = document.getElementById('movie-release-date');
  static movieRuntime = document.getElementById('movie-runtime');
  static movieOverview = document.getElementById('movie-overview');

  static renderMovie(movie) {  
    this.movieBackdrop.src = movie.backdropPath;
    this.movieTitle.innerHTML = movie.title;
    this.movieReleaseDate.innerHTML = movie.releaseDate;
    this.movieRuntime.innerHTML = movie.runtime;
    this.movieOverview.innerHTML = movie.overview;
  }
  
}

class ActorsSection {
  static actorList = document.getElementById('actors');
  
  static renderActors(actors) {
    actors.forEach(actor => this.renderActor(actor));
  }

  static renderActor(actor) {
    this.actorList.insertAdjacentHTML('beforeend', `
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
}

