let loding = false;
fetch(
  "https://votingsyste-production-a0f3.up.railway.app/election/30705484-e91f-11ed-91e0-72fa91e4c633",
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Adjust the content type based on your requirements
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  }
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    let arr = data.data;
    console.log(arr);
    for(let i = 0 ; i < arr.length ; i++){
      let mydiv = document.createElement('div');
      mydiv.innerHTML=`
      <div class="candidate-card">
          <p>${arr[i]["name"]}</p>
          <div><img src="${arr[i]["image"]}" alt="Photo"></div>
          <div class="candidate-info">
            <div>
              <p>age: </p>
              <span>${arr[i]["age"]}</span>
            </div>
            <div>
              <p>party: </p>
              <span>${arr[i]["party"]}</span>
            </div>
            <div>
              <p>education: </p>
              <span>${arr[i]["education"]}</span>
            </div>
          </div>
          <button id="myButton">vote</button>
        </div>`
    console.log(mydiv);
        document.getElementById('grid').appendChild(mydiv);
      }
      loding = true;
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });
if(loding){
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
        this.classList.toggle("selected");
        voteCounter++;
      }
    } else {
      this.style.backgroundColor = mainbackcolor;
      this.classList.toggle("selected");
      voteCounter--;
    }
    cons
  };
});
}