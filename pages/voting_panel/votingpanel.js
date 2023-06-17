let voteCounter = 0;
let mainstyle; //getComputedStyle(document.getElementById("myButton"));
let mainbackcolor; //= mainstyle.backgroundColor;
let voting = [];
let allSize = 0;
let alreadyVoted = false;
async function getData() {
  await fetch(
    `https://votingsyste-production-a0f3.up.railway.app/election/${localStorage.getItem(
      "ip"
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Adjust the content type based on your requirements
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let arr = data.data["candidates"];
      alreadyVoted = data.data["alreadyVoted"];
      console.log(arr);
      for (let i = 0; i < arr.length; i++) {
        let mydiv = document.createElement("div");
        mydiv.innerHTML = `
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
          <button id=${arr[i]["id"]}  style=${arr[i]["voted"]
            ? "background-color:#008000"
            : "background-color:#ff5722"
          }>vote</button>
        </div>`;

        console.log(mydiv);
        document.getElementById("grid").appendChild(mydiv);
        mainstyle = getComputedStyle(document.getElementById(arr[i]["id"]));
        let but = document.getElementById(arr[i]["id"]);
        allSize = data.data["allowedCandidted"];
        // Showing the Number Of Candidates allowed for voting
        console.log(allSize);
        document.getElementById('allowedNumberOfVotes').innerHTML = `Number Of Candidates You Can Choose: (${allSize})`;
        // Showing the Number Of Candidates allowed for voting

        let mainbackcolor = mainstyle.backgroundColor;
        console.log(mainbackcolor);
        if (!alreadyVoted) {
          mydiv.addEventListener("click", () => {
            let styles = getComputedStyle(but);
            console.log(styles.backgroundColor);
            console.log(mainbackcolor);
            if (styles.backgroundColor === mainbackcolor) {
              if (voteCounter < data.data["allowedCandidted"]) {
                but.style.backgroundColor = "green";
                but.classList.toggle("selected");
                voteCounter++;
                voting.push(arr[i]["id"]);
              }
            } else {
              but.style.backgroundColor = mainbackcolor;
              but.classList.toggle("selected");
              voteCounter--;
              let idToDelete = arr[i]["id"];

              let filteredArray = voting.filter((item) => item !== idToDelete);

              voting = filteredArray.map((item) => item);
            }
          });
        }
      }
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
}
getData();
// cancel button
document.getElementById('cancel').addEventListener('click',()=>{
  window.location.href = "../elections/elections.html";
});
// how to make object in js ?
const fol = document.getElementById("sub");
if (!alreadyVoted) {
  fol.addEventListener("click", async () => {
    console.log("///////////////////");
    console.log(alreadyVoted);
    if (!alreadyVoted) {
      let error = document.getElementById("error");
      if (voting.length === 0) {
        error.innerHTML = "Voting anyone to continue";
      } else if (voting.length > allSize) {
        error.innerHTML = `please select only ${allSize}`;
      }
      const data = {
        candidateId: voting,
      };
      await fetch(
        `https://votingsyste-production-a0f3.up.railway.app/election/${localStorage.getItem(
          "ip"
        )}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Adjust the content type based on your requirements
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data), // Adjust the data payload based on your requirements
        }
      )
        .then((response) => response.json())
        .then(
          (data) =>
            (window.location.href = "../voting_history/voting_history.html")
        );
    }
  });
}
