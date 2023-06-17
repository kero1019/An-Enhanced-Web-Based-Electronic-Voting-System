let img = document.querySelector("#photo");
let input_image = document.querySelector("#upload");
let uploadBtn = document.querySelector("#upload-btn");

input_image.addEventListener("change", function () {
  let choosedImage = this.files[0];
  console.log(choosedImage);
  uplaod(this.files[0]);
  if (choosedImage) {
    let reader = new FileReader();
    reader.addEventListener("load", function () {
      img.setAttribute("src", reader.result);
    });
    reader.readAsDataURL(choosedImage);
  }
});

const data2 = {
  name: "string",
  age: 0,
  party: "string",
  education: "string",
  image: "string",
};

async function uplaod(data) {
  console.log("hi///////////////////////////");
  const form_data = new FormData();
  form_data.append("file", data);
  await fetch(
    "https://votingsyste-production-a0f3.up.railway.app/upload/file",
    {
      method: "POST",
      body: form_data,
    }
  )
    .then((response) => response.json())
    .then((json) => {
      console.log("hi");
      console.log(json);
      console.log(data2);

      data2.image = json["url"];
      console.log(data2);
    });

  // ...
}
fetch(
  `https://votingsyste-production-a0f3.up.railway.app/candidate/${localStorage.getItem(
    "candidateId"
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
    if (data["type"] !== "Success") {
      console.log(data);
    }
    data2.name = data["data"]["name"];
    data2.age = data["data"]["age"];
    data2.party = data["data"]["party"];
    data2.education = data["data"]["education"];
    data2.image = data["data"]["image"];

    const form = document.getElementById("data");
    form.name.value = data2.name;
    form.age.value = data2.age;
    form.party.value = data2.party;
    form.education.value = data2.education;
    form.image.src = data2.image;
    // data2.name = form.name.value;
    // data2.age = Number( form.age.value);
    // data2

    // window.location.href = "elections-admin.html";

    // Handle the response data
    console.log(data);
  })

  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });
const form = document.getElementById("data");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  data2.name = e.target.name.value;
  data2.age = Number(e.target.age.value);
  data2.party = e.target.party.value;
  data2.education = e.target.education.value;
  edit();
});
async function edit() {
  await fetch(
    `https://votingsyste-production-a0f3.up.railway.app/candidate/${localStorage.getItem(
      "candidateId"
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // Adjust the content type based on your requirements
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data2),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data["type"] !== "Success") {
        const err = document.getElementById("error");
        console.log(err);
        err.innerHTML = `
      ${data["message"]}
      `;
      }

      window.location.href = "../voting_panel/voting_panel_Admin.html";

      // Handle the response data
      console.log(data);
    })

    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
}

// https://votingsyste-production-a0f3.up.railway.app/api/v1/uploads/69896bd4b-baeb-473d-ad2e-d41b0a62d417.PNG
// https://votingsyste-production-a0f3.up.railway.app/api/v1/uploads/275538395_1488528374895079_8401138668573508110_ncd0aeb1c-5c50-42cd-92d9-30169f891e9a.jpg
