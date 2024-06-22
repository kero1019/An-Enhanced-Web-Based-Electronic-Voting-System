// Current Elections
fetch("https://voting.egyptsunny.com/election/current", {
  method: "GET",
  headers: {
    "Content-Type": "application/json", // Adjust the content type based on your requirements
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    // Handle the response data
    console.log(data);
    let arr = data.data;
    for (let i = 0; i < arr.length; i++) {
      let mydiv = document.createElement("div");
      const originalDate = new Date(`${arr[i]["start"]}`);
      const originalDateEnd = new Date(`${arr[i]["end"]}`);
      mydiv.innerHTML = `
      <div class="current">
          <a class="to-votingpanel" onclick="pop()">
            <div class="election">
              <p id="currentName">${arr[i]["name"]}</p>
              <div class="currentDate">
                <p id="currentStart">${originalDate.toLocaleDateString(
                  "en-GB"
                )}</p>
                <p id="currentEnd">${originalDateEnd.toLocaleDateString(
                  "en-GB"
                )}</p>
              </div>
            </div>
          </a>
        </div>`;
      document.getElementById("current").appendChild(mydiv);
      mydiv.addEventListener("click", (e) => {
        localStorage.setItem("ip", arr[i]["id"]);
      });
    }
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });

// Upcoming Elections
fetch("https://voting.egyptsunny.com/election/upcomming", {
  method: "GET",
  headers: {
    "Content-Type": "application/json", // Adjust the content type based on your requirements
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    // Handle the response data
    console.log(data);
    let arr = data.data.upComming;
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      let mydiv = document.createElement("div");
      const originalDate = new Date(`${arr[i]["start"]}`);
      const originalDateEnd = new Date(`${arr[i]["end"]}`);
      mydiv.innerHTML = `
        <div class="upcoming">
        <div class="election">
          <p>${arr[i]["name"]}</p>
          <div class="currentDate">
              <p id="currentStart">${originalDate.toLocaleDateString(
                "en-GB"
              )}</p>
              <p id="currentEnd">${originalDateEnd.toLocaleDateString(
                "en-GB"
              )}</p>
            </div>
        </div>
      </div>`;
      console.log(mydiv);
      document.getElementById("upcoming").appendChild(mydiv);
    }
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });
// Past Elections
fetch("https://voting.egyptsunny.com/election/past", {
  method: "GET",
  headers: {
    "Content-Type": "application/json", // Adjust the content type based on your requirements
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    // Handle the response data
    console.log(data);
    let arr = data.data.pastElections;
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      let mydiv = document.createElement("div");
      const originalDate = new Date(`${arr[i]["start"]}`);
      const originalDateEnd = new Date(`${arr[i]["end"]}`);
      mydiv.innerHTML = `
        <div class="past">
        <div class="election">
          <p>${arr[i]["name"]}</p>
          <div class="currentDate">
            <p id="currentStart">${originalDate.toLocaleDateString("en-GB")}</p>
            <p id="currentEnd">${originalDateEnd.toLocaleDateString(
              "en-GB"
            )}</p>
          </div>
        </div>
        </div>`;

      console.log("//////////////////////");
      console.log(mydiv);
      document.getElementById("past").appendChild(mydiv);
      mydiv.addEventListener("click", (e) => {
        localStorage.setItem("ip", arr[i]["id"]);
        window.location.href = "../voting_results/voting_results.html";
      });
    }
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });
