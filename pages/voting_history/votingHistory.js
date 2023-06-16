async function getData() {
  await fetch(
    `https://votingsyste-production-a0f3.up.railway.app/user/voting`,
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
      for (let i = 0; i < data.data.length; i += 1) {
        const mydiv = document.createElement("div");
        mydiv.innerHTML = `
        <div class="each_vote">
          <p>${data.data[i]["rank"]}</p>
          <img src=${data.data[i]["candidate"]["image"]} class="prof" />
        <p>${data.data[i]["candidate"]["name"]}</p>
        <p>${data.data[i]["election"]["name"]}</p>
        <div>
          <img src="../../imgs/Small chart line.jpg" alt="Icon" alt="Icon" />
          <p class="per font-inter">${data.data[i]["percent"].toFixed()}%</p>
        </div>
      </div>
        `;
        const parent = document.getElementById("elections");
        parent.appendChild(mydiv);
      }
    });
}

getData();
