let searchArr = [];

//on load functionality
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('history') !== null) {
        searchArr = JSON.parse(localStorage.getItem('history'));
    }

    RequestMovies();

    let search = document.querySelector(".search");
    search.addEventListener("click", () => {
        let query = document.querySelector(".input").value.trim();
        searchMovies(query, false)
    });

    let input = document.querySelector(".input");
    input.addEventListener("click", viewSearchHistory);

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.input')) {
            clearSearch();
        }
    });
});


//api request for a list of movies
const RequestMovies = (query = "") => {

    let url;
    if (query === "") {
        url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
    } else {
        url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;
    }


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
        let id = movie["id"];
        DisplayPoster(imagePath, title, id);
    });
}

//display each movie on the screen
const DisplayPoster = (path, title, id) => {
    let container = document.querySelector(".carousel");
    let img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${path}`;
    img.alt = title;
    img.classList.add(id);
    img.addEventListener("click", fetchMovieDetails);
    container.appendChild(img);
}

//search for a movie with a query
const searchMovies = (query, isHistory) => {
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

    setTimeout(() => {
        movies.scrollIntoView({ behavior: 'smooth' });
    }, 800);

    if (isHistory === false) {
        addToSearchHistory(query);
    }

    clearSearch();

}

//add a search query to the search history
const addToSearchHistory = (query) => {

    if (!searchArr.includes(query)) {
        if (searchArr.length === 5) {
            searchArr.pop();
            searchArr.unshift(query);
        } else {
            searchArr.unshift(query);
        }
    }

    localStorage.setItem("history", JSON.stringify(searchArr));
}

//clear input and hide search history
const clearSearch = () => {
    let input = document.querySelector(".input");
    let header = document.querySelector("header");
    let child = header.lastElementChild;

    setTimeout(() => {
        input.value = "";
    }, 700);

    if (child.tagName === "DIV") {
        header.removeChild(child);
    }

}

//create and show the search history
const viewSearchHistory = () => {
    if (searchArr.length === 0) {
        return;
    }

    let header = document.querySelector("header");
    let child = header.lastElementChild;
    console.log(child);

    if (child.tagName === "DIV") {
        return;
    }

    let div = document.createElement("div");
    div.classList.add("history");

    for (query of searchArr) {
        let p = document.createElement("p");
        let i = document.createElement("i");
        i.classList.add("fa-solid", "fa-clock-rotate-left");
        p.appendChild(i);
        p.appendChild(document.createTextNode(query));
        p.addEventListener('click', () => {
            let query = p.lastChild.nodeValue;
            searchMovies(query, true);
        });
        div.appendChild(p);
    }

    header.appendChild(div);

}

const fetchMovieDetails = (event) => {
    let id = event.target.classList.value;
    console.log("test")
    let url = `https://api.themoviedb.org/3/movie/${id}`
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
        .then(displayDetails)
        .catch(err => console.error('error:' + err));
}

const displayDetails = (json) => {
    console.log(json);
    let title = json["original_title"];
    let poster = json["poster_path"];
    let genres = [];
    for (genre of json["genres"]) {
        genres.push(genre["name"]);
    }
    let homepage = json["homepage"];
    let desc = json["overview"];
    let date = json["release_date"].split("-")[0];

    createPopUp(title, poster, genres, homepage, desc, date);

    setElementOpacity(0.05);
    disableBackground();
}

const setElementOpacity = (opacity) => {
    let main = document.querySelector("main");
    main.style.opacity = opacity;
}

const disableBackground = () => {
    document.body.classList.add('disabled');
    document.body.style.overflow = 'hidden';
}

const enableBackground = () => {
    document.body.classList.remove('disabled');
    document.body.style.overflow = 'auto';
}

const createPopUp = (title, poster, genres, homepage, desc, date) => {
    let movies = document.querySelector("body");
    let main = document.querySelector("main");

    // Create popup div
    const popupDiv = document.createElement('div');
    popupDiv.classList.add('popup');

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.classList.add('close');
    closeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
    closeButton.addEventListener("click", () => {
        let child = movies.lastElementChild;

        if (child.classList.contains("popup")) {
            movies.removeChild(child);
            setElementOpacity(1);
            enableBackground();
        }
    });
    popupDiv.appendChild(closeButton);

    // Create movie info container
    const movieInfoDiv = document.createElement('div');
    movieInfoDiv.classList.add('movie-info');

    // Create poster image
    const posterImg = document.createElement('img');
    posterImg.classList.add('poster');
    posterImg.src = `https://image.tmdb.org/t/p/w500${poster}`;
    posterImg.alt = '';
    movieInfoDiv.appendChild(posterImg);

    // Create details container
    const detailsContainerDiv = document.createElement('div');
    detailsContainerDiv.classList.add('details-container');

    // Create title
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = title;
    detailsContainerDiv.appendChild(titleDiv);

    // Create genre
    const genreDiv = document.createElement('div');
    genreDiv.classList.add('genre');
    genreDiv.innerHTML = `<b>Genres</b> <br>${genres}`;
    detailsContainerDiv.appendChild(genreDiv);

    // Create release date
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    dateDiv.innerHTML = `<b>Release Date</b> <br>${date}`;
    detailsContainerDiv.appendChild(dateDiv);

    // Create description
    const descDiv = document.createElement('div');
    descDiv.classList.add('desc');
    descDiv.innerHTML = `<b>Description</b> <br>${desc}`;
    detailsContainerDiv.appendChild(descDiv);

    // Create homepage link
    const homeDiv = document.createElement('div');
    homeDiv.classList.add('home');
    homeDiv.innerHTML = `<b>Link to <a href="${homepage}">homepage</a></b>`;
    detailsContainerDiv.appendChild(homeDiv);


    movieInfoDiv.appendChild(detailsContainerDiv);
    popupDiv.appendChild(movieInfoDiv);
    movies.appendChild(popupDiv);
}
