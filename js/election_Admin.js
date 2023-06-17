// Current Elections
fetch("https://votingsyste-production-a0f3.up.railway.app/election/current", {
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
          <a>
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
fetch("https://votingsyste-production-a0f3.up.railway.app/election/upcomming", {
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
    for (let i = 0; i < 2; i++) {
      let mydiv = document.createElement("div");
      const originalDate = new Date(`${arr[i]["start"]}`);
      const originalDateEnd = new Date(`${arr[i]["end"]}`);
      mydiv.innerHTML = `
        <div class="upcoming">
        <div class="group">
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
        <div class="election_icons">
            <button class="cancel" id=cancel${arr[i]["id"]}>
              <i class="fa-regular fa-circle-xmark"></i>
            </button>
            <button class="edit" id=edit${arr[i]["id"]}>
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
          </div>
      </div>
      </div>
      `;
      document.getElementById("upcoming").appendChild(mydiv);

      const Delete = document.getElementById(`cancel${arr[i]["id"]}`);
      const Edit = document.getElementById(`edit${arr[i]["id"]}`);
      console.log("******************");
      console.log(mydiv);
      console.log(Edit);
      Edit.addEventListener("click", () => {
        localStorage.setItem("ip", arr[i]["id"]);
        window.location.href = "../elections/edit_election.html";
      });
      Delete.addEventListener("click", () => {
        deleteElection(arr[i]["id"]);
      });
      // console.log(mydiv);
    }
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });
// Past Elections
fetch("https://votingsyste-production-a0f3.up.railway.app/election/past", {
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
        // window.location.href = "../voting_results/voting_results.html";
      });
    }
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });

async function deleteElection(id) {
  console.log(id);
  await fetch(
    `https://votingsyste-production-a0f3.up.railway.app/election/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // Adjust the content type based on your requirements
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      window.location.reload();
      // Handle the response data
      console.log(data);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
}
