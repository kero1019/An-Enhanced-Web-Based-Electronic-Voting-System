// save all vote buttons on myButton variable
myButton = document.querySelectorAll('#myButton');
// counter that i should get from database (Admin)
let count_votes = 0;
for(let i = 0 ; i < myButton.length ; i++){
  myButton[i].style.backgroundColor = "var(--orange)";
  // loop works to change background color and count vote selected
  myButton[i].addEventListener('click', function() {
    if(this.style.backgroundColor === "var(--orange)"){
      this.style.backgroundColor = 'green';
      count_votes++;
    }
    else{
      this.style.backgroundColor = 'var(--orange)';
      count_votes--;
    }
    // check if the the selected votes exceded the limit or not
    if(count_votes >= 2){
      for(let j = 0 ; j < myButton.length ; j++ ){
        if(myButton[j].style.backgroundColor ==="var(--orange)"){
          myButton[j].disabled = true;
        }
      } 
    }
    else{
      for(let j = 0 ; j < myButton.length ; j++ ){
        myButton[j].disabled = false;
      }
    }
  });
}