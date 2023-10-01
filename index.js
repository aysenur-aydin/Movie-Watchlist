const searchBtn = document.getElementById('search-btn');
const movieListSection = document.getElementById('movie-list-section');
const searchInput = document.getElementById('search-input');
const clearPage = document.getElementById('clear-page');

let myWatchlist = [];

document.addEventListener('click', (e) => {
  if (e.target === searchBtn) {
    if (searchInput.value) {
      search(searchInput.value);

      searchInput.value = '';
    } else {
      clearPage.innerHTML = `
                <h4>Unable to find what you're looking for.</h4>
                <h4>Please try another search.<h4>
            `;
    }
  } else if (e.target.dataset.add) {
    const addedBtn = document.getElementById(`${e.target.dataset.add}`);

    addedBtn.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            Added
        `;
    addWatchlist(e.target.dataset.add);
  }
});

async function search(inputValue) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=6c14968&s=${inputValue}`
  );

  const data = await response.json();

  if (data.Search) {
    getMovie(data);
  }
}

async function getMovieDetails(idArr) {
  let movieObj = [];

  for (let i = 0; i < idArr.length; i++) {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=6c14968&i=${idArr[i]}`
    );
    const data = await response.json();
    movieObj.push(data);
  }

  return movieObj;
}

async function getMovie(searchResult) {
  movieListSection.classList.remove('clear-height');

  movieListSection.innerHTML = `
        <div id="movie-card-section" class="movie-card-section"></div>
    `;
  let movieIds = [];

  searchResult.Search.forEach((id) => {
    movieIds.push(id.imdbID);
  });

  let movieId = await getMovieDetails(movieIds);

  let movieList = ``;

  movieId.forEach((result) => {
    movieList += `
            <div id="movie-card" class="movie-card">
                ${
                  result.Poster != 'N/A'
                    ? `<img class="movie-image" src="${result.Poster}"/>`
                    : `<i class="fa-regular fa-image"></i>`
                }
                <div class="movie-text-section">
                    <div class="movie-header">
                        <h4>${result.Title}</h4>
                        <i class="fa-solid fa-star"></i>
                        <span class="movie-rating">${result.imdbRating}</span>
                    </div>
                    <div class="movie-details">
                        <span>${result.Runtime}</span>
                        <span>${result.Genre}</span>
                        <button id="${
                          result.imdbID
                        }" class="watchlist" data-add="${result.imdbID}">
                            <i class="fa-solid fa-circle-plus black"></i>
                            Watchlist
                        </button>
                    </div>
                    <div class="movie-plot">
                        <p>${result.Plot}</p>
                    </div>
                </div>
            </div>
        `;
  });

  document.getElementById('movie-card-section').innerHTML = movieList;
}

function addMovie(data) {
  if (myWatchlist.filter((m) => m.imdbID === data.imdbID).length === 0) {
    myWatchlist.push(data);

    localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist));
  }
}

async function addWatchlist(id) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=6c14968&i=${id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    addMovie(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
