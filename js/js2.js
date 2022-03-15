const overlay = document.querySelector("#overlay");

document.querySelector(".close").addEventListener("click", closeModal);

let modalTitle= document.querySelector(".modal-title");
let modalInputField = document.querySelector(".modal-input-field");

let form = document.querySelector(".modal-input-field");

function createShow() {
  setTitle("Create show");
  setFormDestination("http://localhost:8080/api/shows/create", "post")
  createInput("Movie name", "Batman...", "movieName", "text");
  createInput("Movie genre", "Action...", "genre", "text");
  createInput("Age limit", "12...", "ageLimit", "number")
  createInput("Image Url", "Url...", "imageUrl", "text");
  createInput("Start date", "", "startDate", "date");
  createInput("Finish date", "","finishDate", "date");

  openModal();
}

function setTitle(title) {
  modalTitle.textContent = title;
}

function setFormDestination(action, method) {
  form.setAttribute("action", action);
  form.setAttribute("method", method);
}

function createInput(inputName, placeHolder, idName, type) {
  const title = document.createElement("p");
  const text = document.createTextNode(inputName);
  title.appendChild(text);

  const input = document.createElement("input");
  input.id = idName;
  input.name = idName;
  input.type = type;
  input.placeholder = placeHolder;
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

  form.reset();

  while (modalInputField.hasChildNodes()) {
    modalInputField.removeChild(modalInputField.firstChild);
  }
}

//////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", createFormEventListener);

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
    alert(err.message);
  }
}

async function postFormDataAsJson(url, formData) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);

  const fetchOptions = {
    method: "POST",
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



