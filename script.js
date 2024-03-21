document.addEventListener("DOMContentLoaded", () => {
    const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
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
                console.log("cool");
                return response.json();
            }
            return new Error("Error loading movies");
        })
        .then(getMovies)
        .catch(err => console.error('error:' + err));
});


const getMovies = (json) =>{
    let movies = json["results"];
    console.log(movies);

    movies.forEach(movie => {
        let title = movie["original_title"];
        let imagePath = movie["poster_path"];
        DisplayPoster(imagePath, title);
    });
}

const DisplayPoster = (path,title) => {
    let container = document.querySelector(".carousel");
    let img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${path}`;
    img.alt = title;
    container.appendChild(img);
}