const form = document.getElementById("data");
// Validation
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

const date = document.getElementById("date");
const mobile = document.getElementById("mobile");
const idNum = document.getElementById("idNum");

let check = 0;

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

//check email is valid
function checkEmail(input) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    showSucces(input);
  } else if (input.value.trim() === "") {
    showError(input, `required`);
  } else {
    showError(input, "Email is not invalid");
  }
}

//checkRequired fields
function checkRequired(inputArr) {
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `required`);
    } else {
      showSucces(input);
    }
  });
}
// [show error with field name]
// showError(input,`${getFieldName(input)} is required`)

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

//get FieldName
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// check passwords match
function checkPasswordMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
  } else {
    showSucces(input2);
  }
}

//check password complexity
function checkpasscomplex(input) {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (re.test(input.value.trim())) {
    showSucces(input);
  } else if (input.value.trim() === "") {
    showError(input, "Required");
  } else {
    showError(input, "Must have uppercase, lowercase, special characters, and numbers");
  }
}


// check date
date.addEventListener("change", function () { }); // To get Date changes from input

function getAge(input) {
  var today = new Date();
  var birthDate = new Date(input.value);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 16) {
    showError(date, "Age must be 16 or older");
  } else if (isNaN(age)) {
    showError(date, "Required");
  } else {
    showSucces(date);
  }
}

//check input exact Length
function checkExactLength(input, val) {
  if (input.value.length !== val) {
    showError(input, `${getFieldName(input)} must be ${val} digits`);
  } else {
    showSucces(input);
  }
}

//check numbers only is valid
function checkNumbers(input) {
  const re = /^[0-9]+$/;
  if (re.test(input.value.trim())) {
    showSucces(input);
  } else {
    showError(input, "Numeral Characters are only allowed here [0 - 9]");
  }
}

//check both numbers only & exact length
function checkExactNumbers(input, val) {
  const re = /^[0-9]+$/;
  if (re.test(input.value.trim())) {
    if (input.value.length !== val) {
      showError(input, `${getFieldName(input)} must be ${val} digits`);
    } else {
      showSucces(input);
    }
  } else if (input.value.trim() === "") {
    showError(input, "Required");
  } else {
    showError(input, "Numeral Characters are only allowed here [0 - 9]");
  }
}

//check arabic letters only is valid
function checkLetters(input) {
  const re = /[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]/;
  if (re.test(input.value.trim())) {
    showSucces(input);
  } else if (input.value.trim() === "") {
    showError(input, "Required");
  } else {
    showError(input, "Arabic letters only allowed [أ - ي]");
  }
}

//Event Listeners
form.addEventListener("submit", function (e) {
  e.preventDefault();

  checkRequired([password, password2]);

  checkEmail(email);

  checkLength(password, 8, 25);
  checkPasswordMatch(password, password2);
  checkpasscomplex(password)

  getAge(date);

  checkExactNumbers(mobile, 11);
  checkExactNumbers(idNum, 14);

  checkLetters(username);
  let mycheck = document.getElementsByClassName("success");
  // console.log(mycheck);
  for (let i = 0; i < 7; i++) {
    if (mycheck[i].className === "success" && i === 6) {
      check = 1;
    } else if (mycheck[i] === "error") {
      check = 0;
      break;
    }
  }
});
// Submit form to server
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (check === 0)
    return;
  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const rePassword = e.target.rePassword.value;
  const date = e.target.date.value;
  const gender = e.target.gender.value;
  const phone = e.target.phone.value;
  const ID = e.target.ID.value;
  console.log(gender);
  const data = {
    name: name,
    Email: email,
    Password: password,
    DateOfBirth: date,
    Gender: gender,
    Mobile: phone,
    IDNumber: ID,
  };

  await fetch(
    "https://voting.egyptsunny.com/auth/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Adjust the content type based on your requirements
      },
      body: JSON.stringify(data), // Adjust the data payload based on your requirements
    }
  )
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("secret", data.data.secret);
      if (data.type === "Success" && check === 1) { // I love messi@10
        window.location.href = "register_enter_code.html";
      }
      // Handle the response data
      console.log(data);

      console.log(data.message);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
});

// Cancel Button
document.getElementById('cancel').onclick = function back() {
  window.location.href = "../../index.html";
}
