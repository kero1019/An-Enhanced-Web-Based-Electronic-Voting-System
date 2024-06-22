// upload image for profile
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
  Email: "string",
  age: 20,
  Gender: "string",
  Mobile: "string",
  image: img.getAttribute("src"),
};

async function uplaod(data) {
  const form_data = new FormData();
  form_data.append("file", data);
  await fetch(
    "https://voting.egyptsunny.com/upload/file",
    {
      method: "POST",
      body: form_data,
    }
  )
    .then((response) => response.json())
    .then((json) => {
      console.log("hi");
      console.log(json);
      data2.image = json["url"];
    });

  // ...
}
// catch form
const form = document.getElementById("data");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const Mobile = e.target.phone.value;
  data2.name = name;
  data2.Mobile = Mobile;
  console.log(data2);
  await fetch("https://voting.egyptsunny.com/user", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json", // Adjust the content type based on your requirements
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data2), // Adjust the data payload based on your requirements
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
      console.log(data);

      console.log(data.message);
      window.location.href = "../personal_info/personal_info.html";
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
});

// Cancel Button

function back() {
  window.location.href = "personal_info.html";
}

fetch("https://voting.egyptsunny.com/user", {
  method: "GET",
  headers: {
    "Content-Type": "application/json", // Adjust the content type based on your requirements
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    data2.Email = data.data.Email;
    data2.age = data.data.age;
    data2.Gender = data.data.Gender;
    data2.image = data.data.image;
    document.getElementById("name").value = data.data.name;
    document.getElementById("phone").value = data.data.Mobile;
    document.getElementById(
      "age"
    ).innerHTML = `<span>Age: </span>${data.data.age}`;
    document.getElementById(
      "id"
    ).innerHTML = `<span>ID: </span>${data.data.IDNumber}`;
    document.getElementById(
      "gender"
    ).innerHTML = `<span>Gender: </span>${data.data.Gender}`;
    document.getElementById(
      "mail"
    ).innerHTML = `<span>E-mail: </span>${data.data.Email}`;
    document.getElementById("photo").src = `${data.data.image}`;
    // Handle the response data
    console.log(data);
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });
