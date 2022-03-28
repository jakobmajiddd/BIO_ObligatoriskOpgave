const overlay = document.querySelector("#overlay");

document.querySelector(".close").addEventListener("click", closeModal);

let modalTitle = document.querySelector(".modal-title");
let modalInputField = document.querySelector(".modal-input-field");

let form = document.querySelector(".modal-input-field");

let method;
let showForm = false;
const submitBtn = document.getElementById("submit");
const deleteButton = document.createElement("button");


////////////// Create modals /////////////////////

function createMovie() {
  setMethod("post");
  setTitle("Create Movie");
  setFormDestination("http://localhost:8080/api/movies", "post");

  createInput("Movie name", "Batman...", "name", "text");
  createInput("Movie genre", "Action...", "genre", "text");
  createInput("Age limit", "12...", "ageLimit", "number")
  createInput("Image Url", "Url...", "imageUrl", "text");
  createInput("Duration", "...", "duration", "number");
  createInput("Price", "...", "price", "number");

  setupSubmitButton();

  openModal();
}

function createShow() {
  setMethod("post");
  setTitle("Create show");
  setFormDestination("http://localhost:8080/api/shows", "post")
  createInput("Run time", "", "startDate", "time");
  createDropdownInput("http://localhost:8080/api/rooms", "Room", "room");
  createDropdownInput("http://localhost:8080/api/movies", "Movie", "movie");

  setupSubmitButton();

  showForm = true;
  openModal();
}

function editMovie(movie) {
  setMethod("put");
  setTitle("Edit movie");
  setFormDestination("http://localhost:8080/api/movies/" + movie.id, "put")

  createInput("Movie name", "Batman...", "name", "text", movie.name);
  createInput("Movie genre", "Action...", "genre", "text", movie.genre);
  createInput("Age limit", "12...", "ageLimit", "number", movie.ageLimit)
  createInput("Image Url", "Url...", "imageUrl", "text", movie.imageUrl);
  createInput("Duration", "...", "duration", "number", movie.duration);
  createInput("Price", "...", "price", "number", movie.price);

  displayShows(movie)

  createDeleteButton("http://localhost:8080/api/movies/" + movie.id);
  setupSubmitButton();

  openModal();
}

function editBooking(booking) {
  setMethod("put");
  setTitle("Edit booking");
  setFormDestination("http://localhost:8080/api/bookings/" + booking.id, "put")

  createDeleteButton("http://localhost:8080/api/bookings/" + booking.id);
  setupSubmitButton();

  openModal();
}

//////////////// Modal build functions ///////////////

function setTitle(title) {
  modalTitle.textContent = title;
}

function setMethod(method) {
  this.method = method;
}

function setFormDestination(action, method) {
  form.setAttribute("action", action);
  form.setAttribute("method", method);
}

function createInput(inputName, placeHolder, idName, type, value) {
  const title = document.createElement("p");
  const text = document.createTextNode(inputName);
  title.appendChild(text);

  const input = document.createElement("input");
  input.id = idName;
  input.name = idName;
  input.type = type;
  input.placeholder = placeHolder;
  if (value !== undefined) {
    input.value = value;
  }
  input.classList.add("js-input");


  form.appendChild(title);
  form.appendChild(input);
}

async function createDropdownInput(url, inputName, idName) {
  const title = document.createElement("p");
  const text = document.createTextNode(inputName);
  title.appendChild(text);

  const entities = await fetchEntities(url);
  const select = document.createElement("select");
  select.id = idName;
  select.name = idName;

  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];
    select.add(new Option(entity.name, entity.id));
  }

  form.appendChild(title);
  form.appendChild(select);

}


function openModal() {
  overlay.style.display = "block";
}

function closeModal() {
  overlay.style.display = "none";
  clearModal();
}

function clearModal() {
  modalTitle.textContent = "";
  deleteButton.remove();

  form.reset();

  while (modalInputField.hasChildNodes()) {
    modalInputField.removeChild(modalInputField.firstChild);
  }
}

async function displayShows(movie) {
  const shows = await fetchEntities("http://localhost:8080/api/shows/movie/" + movie.id);
  const header = document.createElement("p");
  header.textContent = "Shows:";
  header.style.fontWeight = "bold";
  form.appendChild(header);
  shows.forEach(s => {
    const div = document.createElement("div");
    div.textContent = s.startDate;
    form.appendChild(div);
  });
}

function createDeleteButton(url) {
  const modalFooter = document.querySelector(".modal-footer")

  deleteButton.id = "delete";
  deleteButton.className = "btn btn-danger remove";
  deleteButton.textContent = "Delete";

  modalFooter.appendChild(deleteButton);

  deleteButton.addEventListener("click", async () => {

    await deleteEntity(url);
    await location.reload();
  });
}

function setupSubmitButton() {
  submitBtn.addEventListener("click", async () => {
    await createFormEventListener();
    await location.reload();
  });
}

function deleteEntity(url) {
  const fetchOptions = {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(url, fetchOptions);
}

//////////////////////////////////////////////////////////////////

const showContainer = document.getElementById("show-container");

loadShows();

async function loadShows() {
  const shows = await fetchEntities("http://localhost:8080/api/movies");

  for (let i = 0; i < shows.length; i++) {
    let show = shows[i];
    const showContainerElement = document.createElement("a");

    const showContainerElementId = document.createElement("div");
    const showContainerElementTitle = document.createElement("div");

    showContainerElementId.textContent = show.id;
    showContainerElementTitle.textContent = show.name;

    showContainerElement.classList.add("show-container-element");
    showContainerElementId.classList.add("show-container-element-id");
    showContainerElementTitle.classList.add("show-container-element-title");

    showContainerElement.addEventListener("click", () => editMovie(show));

    showContainerElement.appendChild(showContainerElementId);
    showContainerElement.appendChild(showContainerElementTitle);

    showContainer.appendChild(showContainerElement);
  }
}

const bookingContainer = document.getElementById("booking-container");

loadBookings();

async function loadBookings(){
  const bookings = await fetchEntities("http://localhost:8080/api/bookings");

  for (let i = 0; i < bookings.length; i++) {
    let booking = bookings[i];
    const showContainerElement = document.createElement("a");
    const showContainerElementId = document.createElement("div");
    const showContainerElementTitle = document.createElement("div");

    showContainerElementId.textContent = booking.id;
    showContainerElementTitle.textContent = booking.customer.email;

    showContainerElement.classList.add("show-container-element");
    showContainerElementId.classList.add("show-container-element-id");
    showContainerElementTitle.classList.add("show-container-element-title");

    showContainerElement.addEventListener("click", () => editBooking(booking));

    showContainerElement.appendChild(showContainerElementId);
    showContainerElement.appendChild(showContainerElementTitle);

    bookingContainer.appendChild(showContainerElement);
  }
}


function fetchEntities(url) {
  return fetch(url).then(response => response.json());

}

/////////////////////////////////////////////////////////////////

function createFormEventListener() {

  form.addEventListener("submit", handleFormSubmit);
  //alert(form.getAttribute("movie"));
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const formEvent = event.currentTarget;
  const url = formEvent.action;

  try {
    const formData = new FormData(formEvent);

    await postFormDataAsJson(url, formData);
  } catch (err) {

  }
}

async function postFormDataAsJson(url, formData) {
  const plainFormData = Object.fromEntries(formData.entries());
  let formDataJsonString;

  if (showForm) {
    const time = plainFormData.startDate;
    const movieId  = document.getElementById("movie").value;
    const roomId = document.getElementById("room").value;

    const show = {};
    show.startDate = time;
    show.room = {};
    show.room.id = roomId;

    show.movie = {};
    show.movie.id = movieId;

    formDataJsonString = JSON.stringify(show);

    showForm = false;
  } else {
    formDataJsonString = JSON.stringify(plainFormData);
  }

  const fetchOptions = {
    method: this.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: formDataJsonString
  };

  const response = await fetch(url, fetchOptions);

  if (!response) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
}
