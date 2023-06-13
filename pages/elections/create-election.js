let form = document.getElementById('data');
let electionName = document.getElementById('electionName');
let candidatesNumber = document.getElementById('candidatesNumber');

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
// check date start end validation
function checkDate() {
  let from = document.getElementById('from');
  let to = document.getElementById('to');

  let start = new Date(from.value);
  let end = new Date(to.value);

  if (from.value !== '' && to.value !== '') {
    if (start > end) {
      showError(from);
      showError(to,'Invalid Date');
    }else {
      showSucces(from);
      showSucces(to);
    }
  }
  else {
    showError(to,'Required');
  }
}

// check Candidates Numbers
function checkCandidatesNumber() {
  let number = candidatesNumber.value;
  if (number === '') {
    showError(candidatesNumber,'Required');
  }else if (number < 1 || number > 5) {
    showError(candidatesNumber,'Number must be between [1 - 5]');
  }else {
    showSucces(candidatesNumber);
  }
}

// Event Listeners
// Validation
form.addEventListener('submit', function (e) {
  e.preventDefault();

  checkLetters(electionName);
  checkDate();
  checkCandidatesNumber();
})

