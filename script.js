
//on load functionality
document.addEventListener("DOMContentLoaded", () => {
    RequestMovies();
    let search = document.querySelector(".search");
    search.addEventListener("click", searchMovies)

    let input = document.querySelector(".input");
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            search.click();
        }
    });
});


//api request for a list of movies
const RequestMovies = (query = "") => {

    const params = {
        include_adult: false,
        language: 'en-US',
        page: 1,
        sort_by: "popularity.desc"
      };

    let url;
    if (query === "") {
        url = 'https://api.themoviedb.org/3/discover/movie';
    } else {
        url = `https://api.themoviedb.org/3/search/movie`;
        params.query = query;
        delete params.sort_by;
    }

    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OGVjNDhjOTAyMDM1MTkzYjEyZjU2YzUzZDFiNzhmMiIsInN1YiI6IjY1Zjk2Yjc4MjRiMzMzMDE4NDdhZDk4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pEtdMHNqCeAdF4Xk_R1u7dEzYA4afuTV1KPF2Y6roao'
        }
    };

    fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            return new Error("Error loading movies");
        })
        .then(getMovies)
        .catch(err => console.error('error:' + err));
}

//get movies information in the retrieved list from the API
const getMovies = (json) => {
    let movies = json["results"];

    movies.forEach(movie => {
        let title = movie["original_title"];
        let imagePath = movie["poster_path"];
        DisplayPoster(imagePath, title);
    });
}

//display each movie on the screen
const DisplayPoster = (path, title) => {
    let container = document.querySelector(".carousel");
    let img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${path}`;
    img.alt = title;
    container.appendChild(img);
}

//search for a movie with a query
const searchMovies = () => {
    let input = document.querySelector(".input");
    let query = input.value.trim();
    let movies = document.querySelector(".movies");
    let p = document.querySelector(".movies p");
    let container = document.querySelector(".carousel");

    if (query === "") {
        movies.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    container.replaceChildren();
    RequestMovies(query);

    p.textContent = `Showing search Results for: ${query}`;

    setTimeout(function () {
        movies.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}