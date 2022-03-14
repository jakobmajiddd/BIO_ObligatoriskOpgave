//function to check userid & password
function check(form) {
    //checkes if username and password are matching
    if(form.username.value == "Jonathan" && form.password.value == "1234") {
    window.open('index.html')//opens the target page while Id & password matches
  } else {
    alert("Error Password or Username");
    }
  }
