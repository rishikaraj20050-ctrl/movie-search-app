const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumber = document.getElementById("pageNumber");

const showFavoritesBtn =
    document.getElementById("showFavoritesBtn");

const searchBtn =
    document.getElementById("searchBtn");

const movieInput =
    document.getElementById("movieInput");

const movieContainer =
    document.getElementById("movieContainer");

const yearFilter =
    document.getElementById("yearFilter");

const typeFilter =
    document.getElementById("typeFilter");

const movieModal =
    document.getElementById("movieModal");

const modalBody =
    document.getElementById("modalBody");

const closeBtn =
    document.getElementById("closeBtn");

const API_KEY = "30b6c031";

let currentPage = 1;
let currentSearch = "";

// Fill Year Dropdown

for (
    let year = new Date().getFullYear();
    year >= 1950;
    year--
) {

    yearFilter.innerHTML += `
        <option value="${year}">
            ${year}
        </option>
    `;

}

// Search Button

searchBtn.addEventListener("click", () => {

    currentPage = 1;

    searchMovie();

});

// Enter Key Search

movieInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        currentPage = 1;

        searchMovie();

    }

});

// Default Search

window.addEventListener("load", () => {

    movieInput.value = "Avengers";

    searchMovie();

});

// Previous Button

prevBtn.addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        searchMovie();

    }

});

// Next Button

nextBtn.addEventListener("click", () => {

    currentPage++;

    searchMovie();

});

async function searchMovie() {

    currentSearch =
        movieInput.value.trim();

    if (!currentSearch) {

        alert("Please enter movie name.");

        return;

    }
        let url =
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${currentSearch}&page=${currentPage}`;

    if (yearFilter.value) {

        url += `&y=${yearFilter.value}`;

    }

    if (typeFilter.value) {

        url += `&type=${typeFilter.value}`;

    }

    pageNumber.innerText = currentPage;

    movieContainer.innerHTML =
        "<h2 style='text-align:center;'>Loading...</h2>";

    try {

        const response =
            await fetch(url);

        const data =
            await response.json();

        movieContainer.innerHTML = "";

        if (data.Response === "False") {

            movieContainer.innerHTML =
                "<h2>No Movies Found</h2>";

            prevBtn.disabled = true;
            nextBtn.disabled = true;

            return;

        }

        const totalResults =
            Number(data.totalResults);

        const totalPages =
            Math.ceil(totalResults / 10);

        prevBtn.disabled =
            currentPage === 1;

        nextBtn.disabled =
            currentPage >= totalPages;

        for (const movie of data.Search) {

            const detailsResponse =
                await fetch(
                    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
                );

            const details =
                await detailsResponse.json();

            movieContainer.innerHTML += `

<div class="movie-card">

<img src="${details.Poster}" alt="${details.Title}">

<h3>${details.Title}</h3>

<p>📅 ${details.Year}</p>

<p class="rating">
⭐ ${details.imdbRating}/10
</p>

<p>
🎭 ${details.Genre}
</p>

<button onclick="showMovieDetails('${details.imdbID}')">
👁 View Details
</button>

<button class="favorite-btn"
onclick="addFavorite('${details.imdbID}')">
❤️ Favorite
</button>

</div>

`;
        }

    }

    catch (error) {

        console.log(error);

        movieContainer.innerHTML =
            "<h2>Something went wrong.</h2>";

    }

}
function addFavorite(id) {

    let favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    if (favorites.includes(id)) {

        alert("Movie already exists in Favorites ❤️");

        return;

    }

    favorites.push(id);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    alert("Movie added to Favorites ❤️");

}

showFavoritesBtn.addEventListener(
    "click",
    showFavorites
);

async function showFavorites() {

    const favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    movieContainer.innerHTML = "";

    pageNumber.innerText = "Favorites";

    prevBtn.disabled = true;
    nextBtn.disabled = true;

    if (favorites.length === 0) {

        movieContainer.innerHTML =
            "<h2>No Favorite Movies ❤️</h2>";

        return;

    }

    for (const id of favorites) {

        const response =
            await fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
            );

        const movie =
            await response.json();

        movieContainer.innerHTML += `

<div class="movie-card">

<img src="${movie.Poster}" alt="${movie.Title}">

<h3>${movie.Title}</h3>

<p>📅 ${movie.Year}</p>

<p class="rating">
⭐ ${movie.imdbRating}/10
</p>

<p>
🎭 ${movie.Genre}
</p>

<button onclick="showMovieDetails('${movie.imdbID}')">
👁 View Details
</button>

<button class="favorite-btn"
onclick="removeFavorite('${movie.imdbID}')">
🗑 Remove
</button>

</div>

`;

    }

}
async function showMovieDetails(id) {

    try {

        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
        );

        const movie = await response.json();

        modalBody.innerHTML = `

<div class="movie-details">

<img src="${movie.Poster}" alt="${movie.Title}">

<div class="movie-info">

<h2>${movie.Title}</h2>

<p><strong>⭐ IMDb Rating:</strong> ${movie.imdbRating}</p>

<p><strong>🎭 Genre:</strong> ${movie.Genre}</p>

<p><strong>🎬 Director:</strong> ${movie.Director}</p>

<p><strong>👨‍🎤 Actors:</strong> ${movie.Actors}</p>

<p><strong>⏱ Runtime:</strong> ${movie.Runtime}</p>

<p><strong>🌍 Language:</strong> ${movie.Language}</p>

<p><strong>📅 Released:</strong> ${movie.Released}</p>

<p><strong>📝 Plot:</strong></p>

<p>${movie.Plot}</p>

</div>

</div>

`;

        movieModal.style.display = "block";

    }

    catch (error) {

        console.log(error);

        alert("Unable to load movie details.");

    }

}

// Remove Favorite

function removeFavorite(id) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favorites =
        favorites.filter(movieId => movieId !== id);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    showFavorites();

}

// Close Modal Button

closeBtn.addEventListener("click", () => {

    movieModal.style.display = "none";

});

// Click Outside Modal

window.addEventListener("click", (event) => {

    if (event.target === movieModal) {

        movieModal.style.display = "none";

    }

});

// ESC Key Close

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        movieModal.style.display = "none";

    }

});

console.log("Movie Search App Loaded Successfully 🚀");