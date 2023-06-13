// to upload image
let img = document.querySelector("#photo");
let input_image = document.querySelector("#upload");
let uploadBtn = document.querySelector("#upload-btn");
input_image.addEventListener("change", function () {
  let choosedImage = this.files[0];
  if (choosedImage) {
    let reader = new FileReader();
    reader.addEventListener("load", function () {
      img.setAttribute("src", reader.result);
    });
    reader.readAsDataURL(choosedImage);
  }
});

let form = document.getElementById('data');
let myPhoto = document.getElementById('photo');
let myName = document.getElementById('cName');
let myAge = document.getElementById('age');
let myParty = document.getElementById('party');
let myedu = document.getElementById('education');
let sub = document.querySelector("#sub");


//Show input error messages
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = 'error';
  const small = formControl.querySelector('small');
  small.innerText = message;
}

//show success colour
function showSucces(input) {
  const formControl = input.parentElement;
  formControl.className = 'success';
}

// check Candidates Numbers
function checkAge() {
  let number = myAge.value;
  if (number === '') {
    showError(myAge,'Required');
  }else if (number < 21) {
    showError(myAge,'Age cant be below 21');
  }else {
    showSucces(myAge);
  }
}

//check arabic letters only is valid
function checkLetters(input) {
  const re = /[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]/;
  if(re.test(input.value.trim())) {
    showSucces(input)
  }else if (input.value.trim() === '') {
    showError(input,'Required');
  }else {
    showError(input,'Arabic letters only allowed [أ - ي]');
  }
}


// Event Listeners
// Validation
form.addEventListener('submit', function (e) {
  e.preventDefault();

  checkLetters(myName);
  checkLetters(myParty);
  checkLetters(myedu);
  checkAge();
})








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
