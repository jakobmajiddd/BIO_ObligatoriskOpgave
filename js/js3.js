const divContainer = document.getElementById("movies");

async function loadShows(){
  const shows = await fetchShows("http://localhost:8080/api/shows");
  for (let i = 0; i < shows.length; i++){
    const show = shows[i];
    const showContainer = document.createElement("img");
    showContainer.classList.add("Card");
    showContainer.src = show.imageUrl;

    showContainer.addEventListener('click',() => {
      localStorage.setItem("show", JSON.stringify(show));
      window.location.href = "show.html"
    })
    //title.href = "http://localhost:8080/api/shows/show/" + shows[i].showId;


    divContainer.appendChild(showContainer);
  }
}

function fetchShows(url){
  return fetch(url).then(response => response.json());

}

loadShows()
