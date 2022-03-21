const overlay = document.querySelector("#overlay");

document.querySelector(".close").addEventListener("click", closeModal);

let modalTitle = document.querySelector(".modal-title");
let modalInputField = document.querySelector(".modal-input-field");

let form = document.querySelector(".modal-input-field");

let method;
let test;
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

  setupSubmitButton();

  openModal();
}

function createShow() {
  setMethod("post");
  setTitle("Create show");
  setFormDestination("http://localhost:8080/api/shows", "post")
  createDropdownInput("http://localhost:8080/api/movies", "Movie", "movie");
  createDropdownInput("http://localhost:8080/api/rooms", "Room", "room");
  createInput("Run time", "", "startDate", "time");

  setupSubmitButton();

  openModal();
}

function updateShow(show) {
  setMethod("put");
  setTitle("Edit show");
  setFormDestination("http://localhost:8080/api/shows/edit/" + show.showId, "put")
  createDropdownInput("", "Batman...", "movieName", "text", show.movieName);
  createInput("Movie genre", "Action...", "genre", "text", show.genre);
  createInput("Age limit", "12...", "ageLimit", "number", show.ageLimit)

  createDeleteButton();
  setupSubmitButton();

  openModal();
}

function createDeleteButton() {
  const modalFooter = document.querySelector(".modal-footer")

  deleteButton.id = "delete";
  deleteButton.className = "btn btn-danger remove";
  deleteButton.textContent = "Delete";

  modalFooter.appendChild(deleteButton);

  deleteButton.addEventListener("click",async () => {

    await deleteShow(show.showId)
    location.reload();
  });
}

function setupSubmitButton() {
  submitBtn.addEventListener("click", async () => {
    await createFormEventListener();
    location.reload();
  });
}

function deleteShow(showId) {
  const fetchOptions = {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const url = "http://localhost:8080/api/shows/delete/" + showId;
  return fetch(url, fetchOptions);
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

  test = entities[0];

  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];
    const option = document.createElement("option");
    option.setAttribute("data-name", entity);
    alert(option.ge);
    option.textContent = entity.name;
    select.appendChild(option);
  }

  //entities.forEach((element, key) => select.add(new Option(element, key);

  //for (let i = 0; i < entities.length; i++) {
  //  let entity = entities[i];
  //  select.add(new Option(entity.name, entity.id));
  //}

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

//////////////////////////////////////////////////////////////////

const showContainer = document.getElementById("show-container");

loadShows();

async function loadShows() {
  const shows = await fetchEntities("http://localhost:8080/api/shows");

  for (let i = 0; i < shows.length; i++) {
    let show = shows[i];
    const showContainerElement = document.createElement("a");

    const showContainerElementId = document.createElement("div");
    const showContainerElementTitle = document.createElement("div");
    const showContainerElementDateFD = document.createElement("div");
    const showContainerElementDateSD = document.createElement("div");

    //slet denne kommentar
    showContainerElementId.textContent = show.showId;
    showContainerElementTitle.textContent  = show.movieName;
    showContainerElementDateFD.textContent = show.finishDate;
    showContainerElementDateSD.textContent = show.startDate;

    showContainerElement.classList.add("show-container-element");
    showContainerElementId.classList.add("show-container-element-id");
    showContainerElementTitle.classList.add("show-container-element-title");
    showContainerElementDateFD.classList.add("show-container-element-date");
    showContainerElementDateSD.classList.add("show-container-element-date");

    showContainerElement.addEventListener("click", () => updateShow(show));

    showContainerElement.appendChild(showContainerElementId);
    showContainerElement.appendChild(showContainerElementTitle);
    showContainerElement.appendChild(showContainerElementDateFD);
    showContainerElement.appendChild(showContainerElementDateSD);

    showContainer.appendChild(showContainerElement);

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
  const formDataJsonString = JSON.stringify(plainFormData);

  const test = formDataJsonString.replace(/\\/g, "");

  const fetchOptions = {
    method: this.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: test
  };

  //alert(fetchOptions.body);





  const response = await fetch(url, fetchOptions);

  if (!response) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
}



