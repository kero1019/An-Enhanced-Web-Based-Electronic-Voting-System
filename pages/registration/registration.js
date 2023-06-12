const form = document.getElementById("data");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const rePassword = e.target.rePassword.value;
  const date = e.target.date.value;
  const gender = e.target.gender.value;
  const phone = e.target.phone.value;
  const ID = e.target.ID.value;
  console.log(gender);
  const data = {
    name: name,
    Email: email,
    Password: password,
    DateOfBirth: date,
    Gender: gender,
    Mobile: phone,
    IDNumber: ID,
  };

  await fetch(
    "https://votingsyste-production-a0f3.up.railway.app/auth/signup",
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
      if (data.type !== "Success") {
        document.getElementById("error").innerHTML = data.message;
      }
      console.log(data.message);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
});
