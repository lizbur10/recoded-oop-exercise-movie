const TMDB_BASE_URL = 'https://api.themoviedb.org/3' // full url for movie add 'movie/<movieId>?api_key=542003918769df50083a13c415bbc602'
                                                      // full url for actors add 'movie/${movieId}/credits?api_key=542003918769df50083a13c415bbc602'
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185' 
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780' // full url add '/<backdrop_path>' (backdrop_path from JSON)

document.addEventListener('DOMContentLoaded', autorun);

function autorun() {
  const movieId = 534;
  const apiKey = '542003918769df50083a13c415bbc602';
  fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}`)
    .then(resp => resp.json())
    .then(json => {
      renderMovie(json);
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${apiKey}`)
        .then(actorResp => actorResp.json())
        .then(actorJson => renderActors(actorJson.cast))
    })
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
  movieRuntime.innerHTML = movie.runtime;
  movieOverview.innerHTML = movie.overview;
}

function renderActors(actors) {
  const actorList = document.getElementById('actors');
  actors.slice(0,4).forEach(actor => {
    console.log(actor.profile_path);
    const li = document.createElement('li');
    li.className = 'col-md-3';
    const imgDiv = document.createElement('div');
    imgDiv.className = 'row';
    const nameDiv = document.createElement('div');
    nameDiv.className = 'row';
    const image = document.createElement('img');
    if (actor.profile_path) {
      image.src = `${PROFILE_BASE_URL}/${actor.profile_path}` //check this - just guessing
    }
    const actorName = document.createElement('h3');
    actorName.innerHTML = actor.name;

    actorList.appendChild(li);
    li.appendChild(imgDiv);
    imgDiv.appendChild(image);
    li.appendChild(nameDiv);
    nameDiv.appendChild(actorName);
  })
}