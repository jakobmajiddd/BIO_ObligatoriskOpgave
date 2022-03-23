const divContainer = document.getElementById("movies");


async function loadMovies(){

  const movies = await fetch("http://localhost:8080/api/movies").then(response => response.json());

  for (let i = 0; i < movies.length; i++){
    const movie = movies[i];
    const showContainer = document.createElement("img");
    showContainer.classList.add("Card");
    showContainer.src = movie.imageUrl;

    showContainer.addEventListener('click',() => {
      localStorage.setItem("movie", JSON.stringify(movie));
      window.location.href = "show.html"
    })
    //title.href = "http://localhost:8080/api/shows/show/" + shows[i].showId;


    divContainer.appendChild(showContainer);
  }
}


loadMovies()
