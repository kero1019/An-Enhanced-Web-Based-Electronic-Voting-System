// to upload image
let img = document.querySelector("#photo");
let input_image = document.querySelector("#upload");
let uploadBtn = document.querySelector("#upload-btn");

input_image.addEventListener("change", function () {
  let choosedImage = this.files[0];
  console.log(choosedImage);
  uplaod(this.files[0]);
  if (choosedImage) {
    let reader = new FileReader();
    reader.addEventListener("load", function () {
      img.setAttribute("src", reader.result);
    });
    reader.readAsDataURL(choosedImage);
  }
});

let form = document.getElementById("data");
let myPhoto = document.getElementById("photo");
let myName = document.getElementById("cName");
let myAge = document.getElementById("age");
let myParty = document.getElementById("party");
let myedu = document.getElementById("education");
let sub = document.querySelector("#sub");

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

// check Candidates Numbers
function checkAge() {
  let number = myAge.value;
  if (number === "") {
    showError(myAge, "Required");
    return false;
  } else if (number < 21) {
    showError(myAge, "Age cant be below 21");
    return false;
  } else {
    showSucces(myAge);
    return true;
  }
}

//check arabic letters only is valid
function checkLetters(input) {
  const re = /[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]/;
  if (re.test(input.value.trim())) {
    showSucces(input);
    return true;
  } else if (input.value.trim() === "") {
    showError(input, "Required");
    return false;
  } else {
    showError(input, "Arabic letters only allowed [أ - ي]");
    return false;
  }
}
const data = {
  name: "e.target.name.value",
  age: " e.target.age.value",
  party: "e.target.party.value",
  education: " e.target.education.value",
  image: "https://www.freepik.com/free-photos-vectors/default",
};
// upload image for profile
async function uplaod(data2) {
  console.log("hi///////////////////////////");
  const form_data = new FormData();
  form_data.append("file", data2);
  await fetch(
    "https://votingsyste-production-a0f3.up.railway.app/upload/file",
    {
      method: "POST",
      body: form_data,
    }
  )
    .then((response) => response.json())
    .then((json) => {
      console.log("hi");
      console.log(json);
      data.image = json["url"];
      console.log(data);
    });

  // ...
}
// Event Listeners
// Validation
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!checkLetters(myName)) return;
  if (!checkLetters(myParty)) return;
  if (!checkLetters(myedu)) return;
  if (!checkAge()) return;
  data.name = e.target.name.value;
  data.age = Number(e.target.age.value);
  data.party = e.target.party.value;
  data.education = e.target.education.value;

  await fetch(
    `https://votingsyste-production-a0f3.up.railway.app/candidate/${localStorage.getItem(
      "ip"
    )}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Adjust the content type based on your requirements
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
      console.log(data);
      window.location.href = "../voting_panel/voting_panel_Admin.html";
    })

    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
});

// console.log("sssssssssss");
// console.log(sub);

// // // to create card
// sub.addEventListener("click", function () {
//   // person.name = myName.value;
//   // person.age = myAge.value;
//   // person.party = myParty.value;
//   // person.edu = myedu.value;
//   // person.photo = reader.reader;
//   all.push(2);
//   console.log("jjhjkjhoklj");
//   window.location.href = "../voting_panel/voting_panel_Admin.html";
// });
