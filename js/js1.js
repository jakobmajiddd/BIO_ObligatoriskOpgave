const out = function (str) {
  console.log(str);
}

const username = document.getElementById("username");
const password = document.getElementById("password");

const pbLogin = document.getElementById("pbLogin");

pbLogin.addEventListener("click", validateUser());

let isAdmin = false;


function validateUser(){
  console.log('Validating user...');
  if (username.contains("Jonathan")) {
    alert(`Hi ${username}`);
    return isAdmin = true;
  } else {
    alert("Unknown user");
    return isAdmin = false;
  }

}

