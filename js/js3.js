const divContainer = document.getElementById("movies");

async function loadShows(){
  const shows = await fetchShows("http://localhost:8080/api/shows");
  for (let i = 0; i < shows.length; i++){
    const showContainer = document.createElement("div");
    showContainer.classList.add("Card");

    const title = document.createElement("a");
    title.textContent = shows[i].movieName;
    title.classList.add("card-atag");
    title.addEventListener('click',() => {
      window.location.href = "show.html"
    })
    //title.href = "http://localhost:8080/api/shows/show/" + shows[i].showId;

    const showP = document.createElement("p");
    const text = document.createTextNode(shows[i].genre);

    showP.appendChild(text);
    divContainer.appendChild(showContainer);
    showContainer.appendChild(title);
    showContainer.appendChild(showP);
  }
}

function fetchShows(url){
  return fetch(url).then(response => response.json());

}

loadShows()
