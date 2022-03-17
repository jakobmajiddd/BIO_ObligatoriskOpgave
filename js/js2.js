const overlay = document.querySelector("#overlay");

document.querySelector(".close").addEventListener("click", closeModal);

let modalTitle= document.querySelector(".modal-title");
let modalInputField = document.querySelector(".modal-input-field");

let form = document.querySelector(".modal-input-field");

let method;
const submitBtn = document.getElementById("submit");

function createShow() {
  setMethod("post");
  setTitle("Create show");
  setFormDestination("http://localhost:8080/api/shows/create", "post")
  createInput("Movie name", "Batman...", "movieName", "text");
  createInput("Movie genre", "Action...", "genre", "text");
  createInput("Age limit", "12...", "ageLimit", "number")
  createInput("Image Url", "Url...", "imageUrl", "text");
  createInput("Start date", "", "startDate", "date");
  createInput("Finish date", "","finishDate", "date");
  createInput("Duration", "...", "duration", "text");

  submitBtn.addEventListener("click", async () => {
    await createFormEventListener();
    location.reload();
  });


  openModal();
}

const deleteButton = document.createElement("button");

function updateShow(show) {
  setMethod("put");
  setTitle("Edit show");
  setFormDestination("http://localhost:8080/api/shows/edit/" + show.showId, "put")
  createInput("Movie name", "Batman...", "movieName", "text", show.movieName);
  createInput("Movie genre", "Action...", "genre", "text", show.genre);
  createInput("Age limit", "12...", "ageLimit", "number", show.ageLimit)
  createInput("Image Url", "Url...", "imageUrl", "text", show.imageUrl);
  createInput("Start date", "", "startDate", "date",  show.startDate);
  createInput("Finish date", "","finishDate", "date", show.finishDate);
  createInput("Duration", "...", "duration", "text", show.duration);


  const modalFooter = document.querySelector(".modal-footer")

  deleteButton.id = "delete";
  deleteButton.className = "btn btn-danger remove";
  deleteButton.textContent = "Delete";

  modalFooter.appendChild(deleteButton);

  deleteButton.addEventListener("click",async () => {

    await deleteShow(show.showId)
    location.reload();
  });

  submitBtn.addEventListener("click", async () => {
    await createFormEventListener();
    location.reload();
  });

  openModal();
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

//////////////// Modal build ///////////////

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
  const shows = await fetchShows("http://localhost:8080/api/shows");

  for (let i = 0; i < shows.length; i++) {
    let show = shows[i];
    const showContainerElement = document.createElement("a");

    const showContainerElementId = document.createElement("div");
    const showContainerElementTitle = document.createElement("div");
    const showContainerElementDateS = document.createElement("div");
    const showContainerElementDateF = document.createElement("div");

    showContainerElementId.textContent = show.showId;
    showContainerElementTitle.textContent  = show.movieName;
    showContainerElementDateS.textContent = show.startDate;
    showContainerElementDateF.textContent = show.finishDate;

    showContainerElement.classList.add("show-container-element");
    showContainerElementId.classList.add("show-container-element-id");
    showContainerElementTitle.classList.add("show-container-element-title");
    showContainerElementDateS.classList.add("show-container-element-date");
    showContainerElementDateF.classList.add("show-container-element-date");

    showContainerElement.addEventListener("click", () => updateShow(show));

    showContainerElement.appendChild(showContainerElementId);
    showContainerElement.appendChild(showContainerElementTitle);
    showContainerElement.appendChild(showContainerElementDateS);
    showContainerElement.appendChild(showContainerElementDateF);

    showContainer.appendChild(showContainerElement);

  }

}


function fetchShows(url) {
  return fetch(url).then(response => response.json());

}

/////////////////////////////////////////////////////////////////

function createFormEventListener() {

  form.addEventListener("submit", handleFormSubmit);
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



