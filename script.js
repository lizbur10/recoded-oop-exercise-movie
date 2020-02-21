// To add home page:
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

class SearchBox {
  static render() {
    const searchForm = document.createElement('form');
    const searchInput = document.createElement('input');
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("placeholder", "Search");
    const submitButton = document.createElement('input');
    submitButton.setAttribute("type", "submit");
    submitButton.addEventListener("click", function(e) {
      e.preventDefault();
      APIService.fetchSearchResults(searchInput.value)
      .then(movies => HomePage.renderMovies(movies));
    })

    HomePage.container.appendChild(searchForm);
    searchForm.appendChild(searchInput);
    searchForm.appendChild(submitButton);    
  }
}

class APIService {

  static TMDB_BASE_URL = 'https://api.themoviedb.org/3'  //https://api.themoviedb.org/3/movie/${movieId}
                                                      //https://api.themoviedb.org/3/movie/${movieId}/credits


  static fetchSearchResults(query) {
    const urlStart = APIService._constructUrl('search/movie');
    const url = urlStart + `&query=${encodeURI(query)}`;
    return fetch(url)
    .then(res => res.json())
    .then(json => json.results.map(movie => new Movie(movie)));
  }

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
  static container = document.getElementById('container');

  static renderMovies(movies) {
    HomePage.container.innerHTML = "";
    SearchBox.render();
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
        HomePage.container.innerHTML = "";
        APIService.fetchMovie(movie.id)
        .then(movie => {
          MoviePage.renderMovieSection(movie)
          APIService.fetchActors(movie)
          .then(actors => {
              MoviePage.renderActorsSection(actors)
          })
      })

      })
      this.container.appendChild(movieDiv);
      movieDiv.appendChild(image);
      movieDiv.appendChild(movieTitle);
    })
  }
}


// change class name to MoviePage
class MoviePage {
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
    SearchBox.render();
    MoviePage.container.innerHTML = `
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

  static renderActors(actors) {
    // add code to render Actors
    // Questions: 
    //    how do we handle selecting the first four?
    //    how do we handle rendering the individual actors?
    const actorsContainer = document.createElement('ul');
    actorsContainer.setAttribute('class', "list-unstyled")
    actorsContainer.setAttribute('id', 'actors');
    console.log(actorsContainer);
    MoviePage.container.appendChild(actorsContainer);
    actors.forEach(actor => this.renderActor(actor, actorsContainer));
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
    this.runtime = json.runtime + " minutes"
    this.overview = json.overview
    this.backdropPath = json.backdrop_path
  }

  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : ""
  }
}

document.addEventListener("DOMContentLoaded", App.run);
