fetch(
  `https://votingsyste-production-a0f3.up.railway.app/election/${localStorage.getItem(
    "ip"
  )}/vote`,
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
    let id = 1;
    for (let i = 0; i < data["data"]["candidates"].length; i += 1) {
      if (
        i > 0 &&
        data["data"]["candidates"][i]["voting"] <
          data["data"]["candidates"][i - 1]["voting"]
      ) {
        id++;
      }
      let mydiv = document.createElement("div");
      mydiv.innerHTML = `
    <div class="each-result flex-center">
    <div class="flex-center">
      <p class="rank">${id}</p>
      <div class="candidate-image">
        <img
          src=${data["data"]["candidates"][i]["candidate"]["image"]}
          alt="Candidate Picture"
        />
      </div>
      <p class="name">${data["data"]["candidates"][i]["candidate"]["name"]}</p>
    </div>
    <div class="flex-center">
      <img src="../../imgs/Small chart line.jpg" alt="Icon" />
      <p class="score font-inter">${data["data"]["candidates"][i]["percent"].toFixed()}%</p>
    </div>
  </div>
    `;
      const winner = document.getElementById("winner");
      const losers = document.getElementById("losers");
      if (id === 1) winner.appendChild(mydiv);
      else losers.appendChild(mydiv);
    }
    // Handle the response data
    console.log(data);
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });
