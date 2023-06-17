let form = document.getElementById("data");
let electionName = document.getElementById("electionName");
let candidatesNumber = document.getElementById("candidatesNumber");

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

// Event Listeners
// Validation
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  checkRequired([electionName]);
  checkDate();
  checkCandidatesNumber();



  const date = new Date(e.target.start.value);
  const date2 = new Date(e.target.end.value);

  const data = {
    name: e.target.name.value,
    start: date,
    end: date2,
    numberOfCandidates: Number(e.target.numberOfCandidates.value),
  };
  await fetch(`https://votingsyste-production-a0f3.up.railway.app/election`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Adjust the content type based on your requirements
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data["type"] !== "Success") {
        const err = document.getElementById("error");
        console.log(err);
        err.innerHTML = `
      ${data["message"]}
      `;
      } else {
        localStorage.setItem("ip", data["data"]["id"]);
        window.location.href = "../voting_panel/voting_panel_Admin.html";
      }
      // console.log("a7a b2a ");

      // Handle the response data
      console.log(data);
    })

    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
});
