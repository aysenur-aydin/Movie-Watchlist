const movieListSection = document.getElementById('movie-list-section')

const storedArray = localStorage.getItem('myWatchlist')

let myList = []

myList = JSON.parse(storedArray)

document.addEventListener('click', e => {
    if (e.target.dataset.remove) {

        let removedMovie = removedMovieObj(e.target.dataset.remove)

        let index = myList.indexOf(removedMovie)

        myList.splice(index, 1)

        localStorage.setItem('myWatchlist', JSON.stringify(myList))

        renderWatchlist()
    }
})

function removedMovieObj(movieId) {

    const movieObj = myList.filter(movie => movie.imdbID == movieId)[0]

    return movieObj
}


function renderWatchlist() {

    if (myList.length > 0) {

        movieListSection.classList.remove('clear-height')

        movieListSection.innerHTML = `<div id="movie-card-section" class="movie-card-section"></div>`

        let watchlistHtml = ``

        myList.forEach(movie => {

            watchlistHtml += `
            <div id="movie-card" class="movie-card">
                ${movie.Poster != "N/A" ? `<img class="movie-image" src="${movie.Poster}"/>` : `<i class="fa-regular fa-image"></i>`}
                <div class="movie-text-section">
                    <div class="movie-header">
                        <h4>${movie.Title}</h4>
                        <span class="movie-rating">
                            <i class="fa-solid fa-star"></i>
                            ${movie.imdbRating}
                        </span>
                    </div>
                    <div class="movie-details">
                        <span>${movie.Runtime}</span>
                        <span>${movie.Genre}</span>
                        <button class="watchlist" data-remove="${movie.imdbID}">
                            <i class="fa-solid fa-circle-minus"></i>
                            Remove
                        </button>
                    </div>
                    <div class="movie-plot">
                        <p>${movie.Plot}</p>
                    </div>
                </div>
            </div>
            `
        })

        document.getElementById('movie-card-section').innerHTML = watchlistHtml

    } else {

        movieListSection.classList.add('clear-height')

        document.getElementById('movie-list-section').innerHTML = `
            <div class="clear-page">
                <p class="watchlist-text">You watchlist is looking a little empty...</p>
                <a href="index.html">
                    <p class="black">
                        <i class="fa-solid fa-circle-plus"></i>
                        Let's add some movies!
                    </p>
                </a>
            </div>
            `
    }

}

renderWatchlist()

