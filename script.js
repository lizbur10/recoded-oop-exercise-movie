// To add actors:
//  modify class App to automatically call fetchMovies insetad of fetchMovie and fetchActors
//  add fetchMovies to APIService X
//  add renderMovies function to Page class (and change name of Page class)
//  add click handler to each movie on the home page to render the MoviePage


class App {
  static run() {
    // Add a call to fetchMovies
    APIService.fetchMovies()
    .then(movies => HomePage.renderMovies(movies));

  }
}

class APIService {

  static TMDB_BASE_URL = 'https://api.themoviedb.org/3'  //https://api.themoviedb.org/3/movie/${movieId}
                                                      //https://api.themoviedb.org/3/movie/${movieId}/credits

  // create fetchMovies method
  static fetchMovies() {
    const url = APIService._constructUrl(`movie/popular`)
    return fetch(url)
      .then(res => res.json())
      .then(json => json.results.map(movie => new Movie(movie)));
  }
  //  use map to create movie instances


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

// Add class HomePage
class HomePage {
// add static renderMovies method
  static moviesList = document.getElementById('movies-list');

  static renderMovies(movies) {
    movies.forEach(movie => {
      // this.moviesList.insertAdjacentHTML('beforeend', `
      //   <img src=${movie.backdropUrl}>
      //   <h3>${movie.title}</h3>
      // `)
      const movieDiv = document.createElement('div');
      const image = document.createElement('img');
      const movieTitle = document.createElement('h3');

      movieTitle.innerHTML = movie.title;
      image.setAttribute('src', movie.backdropUrl);
      image.addEventListener('click', function(){
        HomePage.moviesList.innerHTML = "";
        APIService.fetchMovie(movie.id)
        .then(movie => {
          MoviePage.renderMovieSection(movie)
          APIService.fetchActors(movie)
          .then(actors => {
              MoviePage.renderActorsSection(actors)
          })
      })

      })
      this.moviesList.appendChild(movieDiv);
      movieDiv.appendChild(image);
      movieDiv.appendChild(movieTitle);
    })
  }
}


// change class name to MoviePage
class MoviePage {
  static renderMovieSection(movie) {
    MovieSection.renderMovie(movie)
  }
  static renderActorsSection(movie) {
    ActorsSection.renderActors(movie)
  }
}


class MovieSection {
  static backdrop = document.getElementById('movie-backdrop')
  static title = document.getElementById('movie-title')
  static releaseDate = document.getElementById('movie-release-date')
  static runtime = document.getElementById('movie-runtime')
  static overview = document.getElementById('movie-overview')

  static renderMovie(movie) {
    this.backdrop.src = movie.backdropUrl
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
    return Movie.BACKDROP_BASE_URL + this.backdropPath;
  }
}

document.addEventListener("DOMContentLoaded", App.run);
