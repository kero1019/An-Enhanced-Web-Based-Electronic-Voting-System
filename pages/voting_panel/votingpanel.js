let voteBtn = document.querySelectorAll("#myButton");
let voteCounter = 0;
// get all styles of the button
let mainstyle = getComputedStyle(document.getElementById("myButton"));
// get backgroundColor and 
let mainbackcolor = mainstyle.backgroundColor;

voteBtn.forEach(function (e) {
  e.onclick = function () {
    let styles = getComputedStyle(this);
    if (styles.backgroundColor === mainbackcolor) {
      if (voteCounter < 2) {
        this.style.backgroundColor = "green";
        voteCounter++;
      }
    } else {
      this.style.backgroundColor = mainbackcolor;
      voteCounter--;
    }
  };
});