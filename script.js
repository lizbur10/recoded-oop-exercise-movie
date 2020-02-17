const TMDB_BASE_URL = 'https://api.themoviedb.org/3'        // full url for movie add 'movie/<movieId>?api_key=542003918769df50083a13c415bbc602'
                                                            // full url for actors add 'movie/${movieId}/credits?api_key=542003918769df50083a13c415bbc602'
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'   // full url add '/<profile_path>' (from actor JSON)
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'  // full url add '/<backdrop_path>' (from movie JSON)

document.addEventListener('DOMContentLoaded', autorun);

function autorun() {
  // const movieId = 534; //Terminator Salvation
  // const movieId = 1250; //Ghost Rider
  const movieId =  3034; //Young Frankenstein
  const url = constructUrl(`movie/${movieId}`);
  fetch(url)
    .then(resp => resp.json())
    .then(json => {
      renderMovie(json);
      fetchActors(movieId);
    })
}

function constructUrl(path) {
  return `${TMDB_BASE_URL}/${path}?api_key=542003918769df50083a13c415bbc602`;
}

function fetchActors(movieId) {
  const url = constructUrl(`movie/${movieId}/credits`);
  fetch(url)
    .then(actorResp => actorResp.json())
    .then(actorJson => renderActors(actorJson.cast))
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
  const actorList = document.getElementById('actors');
  actors.slice(0,4).forEach(actor => {
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
  })
}