let voteBtn = document.querySelectorAll("#myButton");
let voteCounter = 0;

// To get backgroundColor of button
let btn = document.getElementById("myButton");
// get all styles of the button
let mainstyle = getComputedStyle(btn);
// get backgroundColor and 
let mainbackcolor = mainstyle.backgroundColor;

voteBtn.forEach(function (e) {
  e.onclick = function () {
    let styles = getComputedStyle(this);
    let backgroundColor = styles.backgroundColor;
    if (backgroundColor === mainbackcolor) {
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
