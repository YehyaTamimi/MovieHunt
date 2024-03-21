let searchArr = [];

//on load functionality
document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem('history') !== null){
        searchArr = JSON.parse(localStorage.getItem('history'));
    }

    RequestMovies();

    let search = document.querySelector(".search");

    search.addEventListener("click", () => {
        let query = document.querySelector(".input").value.trim();
        searchMovies(query, false)});

    let input = document.querySelector(".input");
    input.addEventListener("click", viewSearchHistory);

    document.addEventListener('click', (e) => {
        if(!e.target.closest('.input')){
            clearSearch();

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

const searchMovies = (query, isHistory)=>{
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
        movies.scrollIntoView({ behavior: 'smooth'});
    }, 800);

    if(isHistory === false){
        addToSearchHistory(query);
    }

    clearSearch();
    
}

//add a search query to the search history
const addToSearchHistory = (query)=>{

    if(!searchArr.includes(query)){
        if(searchArr.length === 5){
            searchArr.pop();
            searchArr.unshift(query);
        }else{
            searchArr.unshift(query);
        }
    }

    localStorage.setItem("history", JSON.stringify(searchArr));
}

//clear input and hide search history
const clearSearch = () =>{
    let input = document.querySelector(".input");
    let header = document.querySelector("header");
    let child = header.lastElementChild;

    setTimeout(()=> {
        input.value = "";
    }, 700);

    if(child.tagName === "DIV"){
        header.removeChild(child);
    }

}

//create and show the search history
const viewSearchHistory = () => {
    if(searchArr.length === 0){
        return;
    }

    let header = document.querySelector("header");
    let child = header.lastElementChild;
    console.log(child);
    
    if(child.tagName === "DIV"){
        return;
    }

    let div = document.createElement("div");
    div.classList.add("history");

    for(query of searchArr){
        let p = document.createElement("p");
        let i = document.createElement("i");
        i.classList.add("fa-solid" ,"fa-clock-rotate-left");
        p.appendChild(i);
        p.appendChild(document.createTextNode(query));
        p.addEventListener('click', ()=> {
            let query = p.lastChild.nodeValue;
            searchMovies(query, true);
        });
        div.appendChild(p);
    }

    header.appendChild(div);

}

