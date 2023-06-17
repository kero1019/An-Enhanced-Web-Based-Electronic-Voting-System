let electionName = document.getElementById("electionName");
let candidatesNumber = document.getElementById("candidatesNumber");
let cancel = document.getElementById("cancel");
console.log(cancel);
cancel.addEventListener("click", (e) => {
  console.log("ana d5lt ");
  window.location.href = "elections-admin.html";
  return;
});
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
// check date start end validation
function checkDate() {
  let from = document.getElementById("from");
  let to = document.getElementById("to");

  let start = new Date(from.value);
  let end = new Date(to.value);

  if (from.value !== "" && to.value !== "") {
    if (start > end) {
      showError(from);
      showError(to, "Invalid Date");
      return false;
    } else {
      showSucces(from);
      showSucces(to);
      return true;
    }
  } else {
    showError(to, "Required");
    return false;
  }
}

// check Candidates Numbers
function checkCandidatesNumber() {
  let number = candidatesNumber.value;
  if (number === "") {
    showError(candidatesNumber, "Required");
    return false;
  } else if (number < 1 || number > 5) {
    showError(candidatesNumber, "Number must be between [1 - 5]");
    return false;
  } else {
    showSucces(candidatesNumber);
    return true;
  }
}

const button = document.getElementById("data");
let mycheck = document.getElementsByClassName("success");
let check = 0;
button.addEventListener("submit", (e) => {
  e.preventDefault();

  checkLetters(electionName);
  checkDate();
  checkCandidatesNumber();

  console.log(mycheck);
  for (let i = 0; i < 3; i++) {
    if (mycheck[i].className === "success" && i === 2) {
      check = 1;
    } else if (mycheck[i] === "error") {
      check = 0;
      break;
    }
  }
  console.log(check);
  if (check === 0) {
    console.log("i entered check 0");
    return;
  } else {
    console.log("i entered check 1");
    submit(e);
  }
});

async function submit(e) {
  console.log(e.target.name.value);
  const date = new Date(e.target.start.value);
  const date2 = new Date(e.target.end.value);

  const data = {
    name: e.target.name.value,
    start: date,
    end: date2,
    numberOfCandidates: Number(e.target.numberOfCandidates.value),
  };

  await fetch(
    `https://votingsyste-production-a0f3.up.railway.app/election/${localStorage.getItem(
      "ip"
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // Adjust the content type based on your requirements
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data["type"] !== "Success") {
        const err = document.getElementById("error");
        console.log(err);
        err.innerHTML = `
        ${data["message"]}
        `;
      }

      window.location.href = "elections-admin.html";

      // Handle the response data
      console.log(data);
    })

    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
}
