let check = 0;
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
//Show input error messages
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

//show success colour
function showSucces(input) {
  const formControl = input.parentElement;
  formControl.className = "success";
}
// check passwords match
function checkPasswordMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
  }else {
    showSucces(input2);
  }
}
//check input Length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be les than ${max} characters`
    );
  } else {
    showSucces(input);
  }
}

let form = document.getElementById('data');
form.addEventListener("submit", function (e) {
  e.preventDefault();
  checkLength(password,8,25);
  checkPasswordMatch(password, password2);
  console.log(password2.parentElement.className);
  console.log(password.parentElement.className);
  if(password2.parentElement.className === "error" || password.parentElement.className === "error") {
    check = 0;
  }else {
    check = 1;
  }
  console.log(check);
});
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(check);
  if(check === 0){
    return;
  }
  const name = e.target.password.value;
  const data = {
    password: name,
  };
console.log(data);
  await fetch(
    `https://voting.egyptsunny.com/auth/change_password/${localStorage.getItem("secret")}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Adjust the content type based on your requirements
      },
      body: JSON.stringify(data), // Adjust the data payload based on your requirements
    }
  )
    .then((response) => response.json()) // I love messi@10
    .then((data) => {
      // Handle the response data
      console.log(data);
      window.location.href="/index.html";
      console.log(data.message);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
});