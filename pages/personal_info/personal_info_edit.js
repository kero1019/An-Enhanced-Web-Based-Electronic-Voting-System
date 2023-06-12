// upload image for profile
let img = document.querySelector("#photo");
let input_image = document.querySelector("#upload");
let uploadBtn = document.querySelector("#upload-btn");

input_image.addEventListener("change", function () {
  let choosedImage = this.files[0];
  if (choosedImage) {
    let reader = new FileReader();
    reader.addEventListener("load", function () {
      img.setAttribute("src", reader.result);
    });
    reader.readAsDataURL(choosedImage);
  }
});

// catch form
const form = document.getElementById("data");

form.addEventListener('submit', async(e) => {
  e.preventDefault();
  
  const name = e.target.name.value;
  const Email = e.target.email.value;
  const Gender = e.target.gender.value;
  const Mobile = e.target.phone.value;

  const data = {
    name: name,
    Email: Email,
    age: 0,
    Gender: Gender,
    Mobile: Mobile,
    image: img.getAttribute("src"),
  }

  await fetch(
    "https://votingsyste-production-a0f3.up.railway.app/user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Adjust the content type based on your requirements
      },
      body: JSON.stringify(data), // Adjust the data payload based on your requirements
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
      console.log(data);

      console.log(data.message);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
})

// Cancel Button

function back() {
  window.location.href = 'personal_info.html';
}